# An Overview of Crochet

Crochet is a tool for creating and remixing interactive content in a way
that preserves your security and privacy, even if you want to use code
you've found randomly on the internet.

The core principle of Crochet is that you should _feel_ that it's safe
to experiment with what you want to, without needing to worry
about questions like: "If I install this application, will it try to
steal my banking details next time I use my internet banking?" Or "What
if this application is actually uploading my photos without my consent?"
Or even just "But what if I try this thing and it breaks my computer?"

There's nothing _wrong_ with wondering about these questions. But life
is much better if you don't _need_ to worry about them, because the tool
you're using tries to give you a safe environment for experimentation.
Crochet aims to be that kind of tool.

## But what is Crochet, really?

Crochet is a programming tool. In other words, it's a tool that you use to
create interactive content in a computer. Interactive content has a very broad meaning here.
It can be something like a website, such as Google; an application, such
as Twitter; a visual novel, like Doki Doki Literature Club; rogue-likes, such as Dwarf Fortress; or even more
complex games, such as Fire Emblem or The Sims.

When it comes to creating _video games_, Crochet is particularly suited for
turn-based and story-rich games. The initial motivation to create a tool like
Crochet was to make it easy to write these kind of games. In particular, to
create story-rich games with strong, independent AI characters.

This doesn't mean that you can't build other kinds of games with Crochet, but
you may find that there isn't as much (built-in) support from the tool for
games that deviate too much from this.

Crochet can also be used for areas that are less associated with video games and websites.
For example, one could use Crochet to automate things. An example here would
be building a tool for organising your art folder automatically, ensuring that
the file-names include the date when they were created.

## How is Crochet "safe"?

For most applications you install or run in your computer, the application is
able to do anything to your computer that you, yourself, would be able to do.
It can read any file, _delete_ any file, download malware from the internet,
or even just upload your personal files to the web---without you having any
say on it.

So when you install or run an application you must trust that the application
will do no evil, right? If you just install or run applications from well-known
companies you should be safe, right?

Things are not so simple, unfortunately. Applications may not themselves be
evil, but they may include bugs that allow outsiders to abuse your computer
in the same way. For example, a bug in something like Chrome's auto-update
feature could be abused to download malicious programs from the internet and
run them on your computer---as if the malicious program was Chrome.

Bugs are not the only way malicious programs may end up in your computer. Even
when you only install and run applications from trustworthy sources, those
applications may include parts that are developed by thirdy-parties. These
parts don't always follow the same rigorous and safe management as the company
or person you're trusting, so there's a chance that an attacker will target
these parts in the hopes that they can get malicious programs into common
applications unnoticed.

As an independent content creator, you're likely going to be relying a lot on
parts that were not written by you or by the authors of the Crochet project,
so the same concerns apply---it would be easy for someone to sneak malicious
code into a part you use, and that malicious code would end up executed on
your and your content's users' computers, causing all kinds of havoc. This
is particularly true if you're _remixing_ content---taking something someone
else has built in Crochet, and then making your own experiments on top of
that content.

Because this is the common scenario in Crochet in particular, Crochet takes
a different approach than most interactive content creation tools: Crochet
is a "safety first" tool. What this means is that, instead of allowing
all these parts not written by you to do anything on your (or your users')
computer, _you_ get to decide what they can and can't do.

This is similar to the way most phone OSs work. For example, when you try to
run an application on Android that requires access to your photo library, your
phone will ask if you want to grant that access or not. Crochet does a similar
thing---whenever you use a part made by someone else, you'll see what that part
needs to work, and get to decide whether that sounds reasonable or not to you.

## Where to go from here?

There's currently no user-friendly documentation for Crochet, but some
is planned for the public release.

If you're a professional programmer,
you can learn more about Crochet and where the project is headed from
the documents below.

- [Project roadmap](./ROADMAP.md)
- [Technical overview](./technical-overview)
