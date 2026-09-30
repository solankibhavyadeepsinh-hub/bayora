import asyncio
import json
from typing import Set, Dict, Any

class EventBroadcaster:
    """
    Broadcasts real-time normalized security events to connected SSE listeners.
    """
    def __init__(self):
        self._subscribers: Set[asyncio.Queue] = set()

    async def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue(maxsize=100)
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        if queue in self._subscribers:
            self._subscribers.remove(queue)

    async def broadcast(self, event_data: Dict[str, Any]):
        for queue in list(self._subscribers):
            try:
                queue.put_nowait(event_data)
            except asyncio.QueueFull:
                pass
            except Exception:
                pass

event_broadcaster = EventBroadcaster()
