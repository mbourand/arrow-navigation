import { SelectableGroupType, SelectableType } from './types'

export type EventType = 'elementRegistered' | 'groupRegistered' | 'elementUnregistered' | 'groupUnregistered'

export type EventHandlers = {
  elementRegistered?: ((selectable: SelectableType) => void)[]
  elementUnregistered?: ((id: string) => void)[]
  groupRegistered?: ((group: SelectableGroupType) => void)[]
  groupUnregistered?: ((id: string) => void)[]
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
