interface WebsocketResource<T> {
  live: Accessor<boolean>;
  latest: Accessor<T | null>;
  open: VoidFunction;
  close: VoidFunction;
}
