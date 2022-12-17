# Key/Value storage

This package provides a way of storing values associated with unique keys. It works for things like program configuration and other small pieces of data that should be persisted across sessions/restarts.

Storage is partitioned, meaning that different packages are not able to see or interfere with each other's stored values. So, as an application, you don't have to worry about a dependency peeking or trampling with your data. However, since the backing storage is still shared, dependencies' usage of their partitions will still contribute to the same global usage quota.

The package supports pluggable backends for the storage, as well as pluggable serialisation strategies, if they're needed for more complex use cases.


## Usage example

To use this package you need to create at least one storage partition. That's granted by the [capability:key-value-storage] capability, which your package must request. For example, say you're using a storage for your application's configuration, you could define a partition like this:

    open crochet.storage.key-value;

    define configuration-partition =
      (lazy #kv-store-location for: package key: "configuration");

    define configuration-store =
      (lazy kv-store for: (force configuration-partition));

You would then use this storage partition where you load or save your application's configuration:

    type options(
      bgm-volume is integer,
      sfx-volume is integer,
      voice-volume is integer,
    );

    command options save do
      let Store = force configuration-store;
      Store at: "bgm-volume" store: self.bgm-volume;
      Store at: "sfx-volume" store: self.sfx-volume;
      Store at: "voice-volume" store: self.voice-volume;
    end

    command #options load do
      let Store = force configuration-store;
      let Bgm = Store at: "bgm-volume" default: 80;
      let Sfx = Store at: "sfx-volume" default: 80;
      let Voice = Store at: "voice-volume" default: 80;
      new options(
        bgm-volume -> Bgm,
        sfx-volume -> Sfx,
        voice-volume -> Voice
      );
    end

Lastly, you need to choose a backing storage strategy for your key/value storage. This strategy is installed as an effect handler, so you'd generally use it at the entry-point of your application. For example, to use the LocalStorage backend you'd write:

    open crochet.storage.key-value;

    command main: Root do
      handle
        let Options = #options load;
        game show-options;
        Options save;
      with
        use kv-local-storage-backend;
      end
    end


## Architecture

The entry-point of this package is [type:kv-store], which allows one to construct new partitioned storages. Each partitioned storage is represented by [type:kv-storage], which exposes an interface similar to that of [type:map].

Each partition is defined by a type implementing [trait:kv-location]. Every package (see [type:any-package]) works as a location as well, and the type [type:kv-store-location] allows packages to have multiple independent partitions.

Storage backends are an implementation of the [effect:kv-storage] effect. This defines backends in terms of essential operations on a text-only key/value store. Performance and space considerations are up to each backend, but implementations are required to guarantee atomicity.

Because storage backends only handle text, it's necessary to serialise values and parse them if we want to support storing complex data. This is handled by implementing [trait:kv-serialisation]. By default partitioned storages use a [type:extended-json] serialisation, provided by the [type:kv-json-serialisation] type, but it's possible to also provide an extended JSON instance that supports the application's own custom types (e.g.: those using `@| derive: "json"`).

These serialisation strategies are specified when constructing each partitioned storage, by using the [command: kv-store for: _ serialisation: _] command.
