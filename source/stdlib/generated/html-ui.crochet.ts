export default "% crochet\r\n\r\ntype html-element = foreign crochet.ui.html.element;\r\ntype html-menu = foreign crochet.ui.html.menu;\r\n\r\nsingleton html;\r\nsingleton ui;\r\n\r\ncommand html show: X =\r\n  foreign crochet.ui.html.show(X);\r\n\r\ncommand html wait-click =\r\n  foreign crochet.ui.html.wait();\r\n\r\ncommand html box: Name class: Class attributes: Attrs children: Children =\r\n  foreign crochet.ui.html.box(Name, Class, Attrs, Children);\r\n\r\ncommand html text: Text =\r\n  foreign crochet.ui.html.text(Text);\r\n\r\ncommand html menu: Items class: Class =\r\n  foreign crochet.ui.html.menu(Class, Items);\r\n\r\ncommand (X is html-menu) selected =\r\n  foreign crochet.ui.html.menu-selected(X);\r\n\r\ncommand html preload: Url =\r\n  foreign crochet.ui.html.preload(Url);\r\n\r\ncommand html image: Url =\r\n  foreign crochet.ui.html.image(Url);\r\n\r\ncommand html animate: Element frame-rate: Rate =\r\n  foreign crochet.ui.html.animate(Element, Rate);\r\n\r\ncommand html make-animation: Elements =\r\n  foreign crochet.ui.html.make-animation(Elements);\r\n\r\ncommand html mark =\r\n  foreign crochet.ui.html.mark();\r\n\r\ncommand X show do\r\n  X to-html show;\r\nend\r\n\r\ncommand (X is html-element) show do\r\n  html show: X;\r\nend\r\n\r\ncommand X show-wait do\r\n  X show;\r\n  wait-click;\r\nend\r\n\r\ncommand ui mark do\r\n  html mark;\r\nend\r\n\r\ncommand X to-html do\r\n  X debug-representation text;\r\nend\r\n\r\ncommand (X is html-element) to-html do\r\n  X;\r\nend\r\n\r\ncommand (X is text) to-html do\r\n  X text;\r\nend\r\n\r\ncommand (X is interpolation) to-html do\r\n  X parts to-html;\r\nend\r\n\r\ncommand (Xs is stream) to-html do\r\n  let Items = for X in Xs do X to-html end;\r\n  html box: \"span\"\r\n       class: \"crochet-stream\"\r\n       attributes: [->]\r\n       children: Items;\r\nend\r\n\r\n\r\ncommand (Text is text) text do\r\n  html text: Text;\r\nend\r\n\r\ncommand preload: (Url is text) do\r\n  html preload: Url;\r\nend\r\n\r\ncommand html-element animate: (FrameRate is integer) do\r\n  html animate: self frame-rate: FrameRate;\r\nend\r\n\r\ncommand image: (Url is text) do\r\n  html box: \"img\"\r\n       class: \"crochet-image\"\r\n       attributes: [src -> Url]\r\n       children: [];\r\nend\r\n\r\ncommand animation: (Elements is stream) do\r\n  html make-animation: (for X in Elements do X to-html end);\r\nend\r\n\r\ncommand header: X do\r\n  html\r\n    box: \"header\"\r\n    class: \"crochet-header\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand title: X do\r\n  html\r\n    box: \"h1\"\r\n    class: \"crochet-title\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand subtitle: X do\r\n  html\r\n    box: \"h2\"\r\n    class: \"crochet-subtitle\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand monospace: X do\r\n  box: \"crochet-mono\" children: X;\r\nend\r\n\r\ncommand paragraph: X do\r\n  html \r\n    box: \"p\"\r\n    class: \"crochet-paragraph\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand box: (Class is text) children: X do\r\n  html box: \"div\"\r\n       class: Class\r\n       attributes: [->]\r\n       children: [X to-html];\r\nend\r\n\r\ncommand flow: X do\r\n  box: \"crochet-flow\" children: X to-html;\r\nend\r\n\r\ncommand stack: X do\r\n  box: \"crochet-stack\" children: X to-html;\r\nend\r\n\r\ncommand emphasis: X do\r\n  html\r\n    box: \"em\"\r\n    class: \"crochet-emphasis\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand strong: X do\r\n  html\r\n    box: \"strong\"\r\n    class: \"crochet-strong\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand ui divider do\r\n  box: \"crochet-divider\" children: [];\r\nend\r\n\r\ncommand section: X do\r\n  html\r\n    box: \"section\"\r\n    class: \"crochet-section\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand button: X do\r\n  html\r\n    box: \"div\"\r\n    class: \"crochet-button\"\r\n    attributes: [->]\r\n    children: [X to-html];\r\nend\r\n\r\ncommand menu: (Items0 is stream) do\r\n  let Items = for X in Items0 do\r\n    [\r\n      Title -> (button: X.Title to-html),\r\n      Value -> X.Value,\r\n    ]\r\n  end;\r\n\r\n  html\r\n    menu: Items\r\n    class: \"crochet-menu\";\r\nend"