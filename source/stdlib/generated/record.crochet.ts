export default "% crochet\r\n\r\ncommand (X is record) ++ (Y is record) =\r\n  foreign crochet.native.record.merge(X, Y);\r\n\r\ncommand (X is record) keys =\r\n  foreign crochet.native.record.keys(X);\r\n\r\ncommand (X is record) values =\r\n  foreign crochet.native.record.values(X);\r\n\r\ncommand (X is record) count =\r\n  foreign crochet.native.record.count(X);"