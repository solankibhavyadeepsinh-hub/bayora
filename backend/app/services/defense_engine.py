import re
from typing import List, Tuple, Optional, Dict, Any
from app.models.defense import DefenseRule

class DefenseEngine:
    """
    Blue Team defense evaluation engine. Executes input and output guardrails.
    Maintains dual-blind isolation:
    - Generates sanitized telemetry for Blue (redacted signatures, no raw payload).
    """

    def evaluate_input_rules(self, rules: List[DefenseRule], prompt: str) -> Tuple[bool, Optional[DefenseRule], str, str]:
        """
        Evaluates prompt against active Blue input rules.
        Returns:
            (blocked: bool, triggered_rule: Optional[DefenseRule], action: str, sanitized_snippet: str)
        """
        for rule in rules:
            if not rule.is_active or rule.stage != "INPUT_FILTER":
                continue

            matched = False
            matched_substr = ""

            if rule.rule_type == "REGEX":
                try:
                    match = re.search(rule.pattern, prompt, re.IGNORECASE)
                    if match:
                        matched = True
                        matched_substr = match.group(0)
                except re.error:
                    pass

            elif rule.rule_type == "KEYWORD":
                keywords = [k.strip().lower() for k in rule.pattern.split(",") if k.strip()]
                for kw in keywords:
                    if kw in prompt.lower():
                        matched = True
                        matched_substr = kw
                        break

            elif rule.rule_type == "CANARY_GUARD":
                if any(k in prompt.lower() for k in ["canary", "token", "reveal key", "secret"]):
                    matched = True
                    matched_substr = "canary_probe"

            elif rule.rule_type == "ENTROPY":
                # High density of special characters or suspicious base64 / hex obfuscation
                if len(prompt) > 20 and len(re.findall(r"[^a-zA-Z0-9\s]", prompt)) / len(prompt) > 0.40:
                    matched = True
                    matched_substr = "high_entropy_obfuscation"

            if matched:
                # Create sanitized snippet for Blue (mask raw payload to preserve dual-blind rule)
                masked_content = f"[{rule.owasp_category.split(':')[0]} PATTERN DETECTED: '***{matched_substr[:4]}...' | Rule: {rule.id}]"
                
                if rule.action == "BLOCK":
                    return True, rule, "BLOCK", masked_content
                elif rule.action == "SANITIZE":
                    # For sanitize, caller will replace and continue
                    return False, rule, "SANITIZE", masked_content
                elif rule.action == "ALERT":
                    return False, rule, "ALERT", masked_content

        return False, None, "ALLOW", ""

    def evaluate_output_rules(self, rules: List[DefenseRule], output_text: str, canary_token: str = "") -> Tuple[bool, Optional[DefenseRule], str]:
        """
        Evaluates model response against active Blue output rules (preventing canary or secret leak).
        Returns:
            (blocked: bool, triggered_rule: Optional[DefenseRule], sanitized_output: str)
        """
        # Built-in canary leak prevention
        if canary_token and canary_token in output_text:
            return True, None, "Response blocked by output security policy: Canary token leak detected."

        for rule in rules:
            if not rule.is_active or rule.stage != "OUTPUT_FILTER":
                continue

            matched = False
            if rule.rule_type == "REGEX":
                try:
                    if re.search(rule.pattern, output_text, re.IGNORECASE):
                        matched = True
                except re.error:
                    pass
            elif rule.rule_type == "KEYWORD":
                keywords = [k.strip().lower() for k in rule.pattern.split(",") if k.strip()]
                for kw in keywords:
                    if kw in output_text.lower():
                        matched = True
                        break

            if matched:
                if rule.action == "BLOCK":
                    return True, rule, "Response blocked by output security policy."
                elif rule.action == "SANITIZE":
                    # Redact matching items
                    sanitized = re.sub(rule.pattern, "[REDACTED BY DEFENSE]", output_text, flags=re.IGNORECASE)
                    return False, rule, sanitized

        return False, None, output_text

defense_engine = DefenseEngine()
