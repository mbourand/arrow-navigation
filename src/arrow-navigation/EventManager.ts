import { SelectableRegionType, SelectableType } from './types'

export type EventType =
  | 'elementRegistered'
  | 'regionRegistered'
  | 'elementUnregistered'
  | 'regionUnregistered'
  | 'onElementFocused'
  | 'onRegionLeaved'

export type EventHandlers = {
  // Registering events
  elementRegistered: (selectable: SelectableType) => void
  elementUnregistered: (id: string) => void
  regionRegistered: (region: SelectableRegionType) => void
  regionUnregistered: (id: string) => void

  // Focus events
  onElementFocused: (selectable: SelectableType) => void
  onRegionLeaved: (region: SelectableRegionType) => void
}

type EventHandlersArray = {
  [K in keyof EventHandlers]?: {
    fn: EventHandlers[K]
    signal: AbortSignal
    abortListenerController: AbortController
  }[]
}

export class ArrowNavigationEventManager {
  private eventHandlers: EventHandlersArray = {}

  on = <T extends EventType>(event: T, listener: EventHandlers[T], signal: AbortSignal) => {
    this.eventHandlers[event] ??= []

    const abortController = new AbortController()
    // As never is fine here because the type is checked via the parameter type
    this.eventHandlers[event].push({ fn: listener as never, signal, abortListenerController: abortController })

    signal.addEventListener('abort', () => this.off(event, listener), { signal: abortController.signal })
  }

  off = <T extends EventType>(event: T, listener: EventHandlers[T]) => {
    if (!this.eventHandlers[event]) return

    const indicesToRemove = this.eventHandlers[event]
      .map((handler, i) => (handler.fn === listener ? i : null))
      .filter((i) => i !== null)

    for (const index of indicesToRemove) {
      this.eventHandlers[event][index].abortListenerController.abort()
      this.eventHandlers[event].splice(index, 1)
    }
  }

  emit = <T extends EventType>(event: T, ...args: Parameters<EventHandlers[T]>) => {
    if (!this.eventHandlers[event]) return

    // Casting is fine here because parameter validity is checked via the type of args
    this.eventHandlers[event].forEach((handler) => (handler.fn as (...args: unknown[]) => unknown)(...args))
  }
}
