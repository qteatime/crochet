# Key/Value storage

This package allows associating unique names with Crochet values, and keeping them around persistently somewhere. The storage location and strategy are configurable.


## Example

    open crochet.storage.durable.key-value;

    type game(name is text, level is integer);

    command game save: (Slot is text) do
      let Storage = kv-store for: package;
      Storage at: Slot put: [
        name -> self.name,
        level -> self.level
      ];
    end

    command #game load: (Slot is text) do
      let Storage = kv-store for: package;
      let Data = Storage at: Slot;
      new game(
        name -> Data.name,
        level -> Data.level
      );
    end


## Interface

The package provides a single entry-point, the `kv-store` singleton. In order to store or access data, one must first provide a stable location key, which Crochet uses in order to prevent other packages in an application to tamper with the data you store. The `package` type itself works as a stable location key. Stronger keys are possible with the `kv-store-location` type.

Once a storage is constructed from `kv-store`, its interface is similar to that of `map`, implementing much of the same traits. Values stored in this storage need a way of serialising themselves, the storage offers `json`, `extended-json`, and `ljt` as serialisation strategies, with `json` being the default one.


