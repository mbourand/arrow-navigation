import { SelectableGroupType, SelectableType } from './types'

export type EventType =
  | 'elementRegistered'
  | 'groupRegistered'
  | 'elementUnregistered'
  | 'groupUnregistered'
  | 'onElementFocused'
  | 'onGroupLeaved'

export type EventHandlers = {
  // Registering events
  elementRegistered?: ((selectable: SelectableType) => void)[]
  elementUnregistered?: ((id: string) => void)[]
  groupRegistered?: ((group: SelectableGroupType) => void)[]
  groupUnregistered?: ((id: string) => void)[]

  // Focus events
  onElementFocused?: ((selectable: SelectableType) => void)[]
  onGroupLeaved?: ((group: SelectableGroupType) => void)[]
}

export class ArrowNavigationEventManager {
  private listeners: EventHandlers = {}

  on = <T extends EventType>(event: T, listener: NonNullable<EventHandlers[T]>[number]) => {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push(listener as never)
  }

  off = <T extends EventType>(event: T, listener: NonNullable<EventHandlers[T]>[number]) => {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event] = this.listeners[event].filter((l) => l !== listener) as never
  }

  emit = <T extends EventType>(event: T, ...args: Parameters<NonNullable<EventHandlers[T]>[number]>) => {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event].forEach((listener) => (listener as (...args: unknown[]) => unknown)(...args))
  }
}
