export class Maybe<T> {
  #value: T | null | undefined;

  private constructor(value: T | null | undefined) {
    this.#value = value;
  }

  public static just<T>(value: T) {
    if (!value) throw Error('Provided value must not be empty');

    return new Maybe(value);
  }

  public static nothing<T>() {
    return new Maybe<T>(null);
  }

  public static of<T>(value: T | null | undefined) {
    return value ? Maybe.just(value) : Maybe.nothing<T>();
  }

  public isNothing() {
    return this.#value === null || this.#value === undefined;
  }

  public getOrElse<U>(defaultValue: U): T | U {
    return this.isNothing() ? defaultValue : (this.#value as T);
  }

  public getOrExecute<U>(fn: () => U): T | U {
    return this.isNothing() ? fn() : (this.#value as T);
  }

  public getOrThrow<E extends Error>(error: E): T {
    if (this.isNothing()) throw error;

    return this.#value as T;
  }

  public value(): T | null | undefined {
    return this.#value;
  }

  public map<U>(fn: (wrapped: T) => U): Maybe<U> {
    return this.isNothing() ? Maybe.nothing<U>() : Maybe.of(fn(this.#value as T));
  }

  public flatMap<U>(fn: (wrapped: T) => Maybe<U>): Maybe<U> {
    return this.isNothing() ? Maybe.nothing<U>() : fn(this.#value as T);
  }
}
