# [#0013] - Archives and scoped filesystems

|                  |                    |
| ---------------- | ------------------ |
| **Authors**      | Q.                 |
| **Last updated** | 19th February 2022 |
| **Status**       | Draft              |

## Summary

Crochet applications need to contend with two primary problems when it comes to storage:

- It must ensure that storage/resource access follows the same capability rules code entities do. That is, package A should never be able to read files of package B (or really anywhere else).

- It must apply these rules regardless of how storage backends work: the same must be true in ext4, ntfs, or virtual file systems like the one Crochet's server mounts on top of HTTP; and

- It must be reasonably efficient across all of these different storage mediums.

This proposal extends Crochet's VM with the idea of (read-only) scoped file systems and adds an archive format to address latency issues with scoped file systems mounted over HTTP.

## What's a scoped file system?

A scoped file system is a restricted file system that provides access to objects addressed by a unique identifier. In this case, the identifier is a regular `path`.

In essence, this means that a scoped file system is a mapping of `path` to `file`, where a file contains metadata and the binary blob of the contents. For example:

```
{
  "source/core.crochet": {
    metadata: { ... },
    data: "..."
  },
  ".binary/core.croc": {
    metadata: { ... },
    data: "..."
  }
}
```

Is a scoped file system that grants access to exactly two files.

## Storage backends

What provides the metadata and data portions of each file is a storage backend. This proposal describes two backends:

- The `native-filesystem-mapper` backend maps the scoped files to absolute locations in the underlying OS's file system.

- the `http-filesystem-mapper` backend maps the scoped files to HTTP URLs, assuming that the underlying HTTP server is going to provide a file system under those endpoints.

- The `snapshot-archive` backend provides all files as a single, read-only binary archive file that's optimised for upfront unpacking in memory (so no random access allowed).

## Snapshot archives

A snapshot archive is a simple binary format that packs several files into one to address latency issues with distributing Crochet programs over the network. Its header is as follows:

```
CARC                // magic string
<VERSION:uint16>    // format version
<SIZE:uint32>       // number of files in the archive
```

Each file follows this header with the following format:

```
<PATH:string>       // 32bit size + <size> UTF-8 bytes
<HASH:bytes>        // 32bit size + <size> bytes
<BLOB:bytes>        // 32bit size + <size> bytes
```
