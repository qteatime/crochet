export default "% crochet\r\n\r\ncommand (X is text) ++ (Y is text) = \r\n  foreign crochet.native.text.concat(X, Y);\r\n\r\n\r\ncommand (X is interpolation) ++ (Y is interpolation) =\r\n  foreign crochet.native.interpolation.concat(X, Y);\r\n\r\ncommand (X is text) ++ (Y is interpolation) do\r\n  (X as interpolation) ++ Y;\r\nend\r\n\r\ncommand (X is interpolation) ++ (Y is text) do\r\n  X ++ (Y as interpolation);\r\nend\r\n\r\n\r\ncommand (X is interpolation) parts = \r\n  foreign crochet.native.interpolation.parts(X);\r\n\r\ncommand (X is interpolation) holes =\r\n  foreign crochet.native.interpolation.holes(X);\r\n\r\ncommand (X is interpolation) static-text =\r\n  foreign crochet.native.interpolation.static-text(X);"