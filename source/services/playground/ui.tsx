import * as React from "react";
import * as IR from "../../ir";
import * as Compiler from "../../compiler";
import { BootedCrochet, CrochetValue } from "../../crochet";
import { unreachable } from "../../utils/utils";
import { AddButton, Button, Column, Icon, IElement, If } from "../ui/basic";
import { CodeEditor } from "../ui/code-editor";
import { Value } from "../ui/value";
import { CrochetModule, Environment, Environments } from "../../vm";

type IPlayground = {
  crochet: BootedCrochet;
  module: CrochetModule;
};
type IPlaygroundState = {
  editors: { id: number; editor: React.ReactNode }[];
};

export class PlaygroundUI extends React.Component<
  IPlayground,
  IPlaygroundState
> {
  private id = 0;

  private next_id() {
    return ++this.id;
  }

  constructor(props: IPlayground) {
    super(props);
    this.state = {
      editors: [this.make_editor()],
    };
  }

  render() {
    return (
      <div className="crochet-ui--playground">
        <Column style="crochet-ui--playground-notebook">
          {this.state.editors.map((a) => a.editor)}
        </Column>
        <AddButton onClick={this.addEditor}></AddButton>
      </div>
    );
  }

  make_editor() {
    const id = this.next_id();
    return {
      id,
      editor: (
        <PlaygroundEditor
          code=""
          key={id}
          crochet={this.props.crochet}
          module={this.props.module}
          dispose={() => this.removeEditor(id)}
        />
      ),
    };
  }

  addEditor = () => {
    this.setState({
      editors: [...this.state.editors, this.make_editor()],
    });
  };

  removeEditor = (id: number) => {
    this.setState({ editors: this.state.editors.filter((e) => e.id !== id) });
  };
}

class PEOk {
  constructor(readonly value: CrochetValue) {}
}

class PEFail {
  constructor(readonly error: any) {}
}

class PEMessage {
  constructor(readonly message: React.ReactNode) {}
}

type PEResult = PEOk | PEFail | PEMessage;

type PEProps = IElement & {
  code: string;
  crochet: BootedCrochet;
  module: CrochetModule;
  dispose?: () => void;
};
type PEState = {
  code: string;
  result: PEResult | null;
  changed: boolean;
  running: boolean;
};

export class PlaygroundEditor extends React.Component<PEProps, PEState> {
  readonly editor = React.createRef<CodeEditor>();

  constructor(props: PEProps) {
    super(props);
    this.state = {
      code: "",
      result: null,
      changed: false,
      running: false,
    };
  }

  codeChanged = (code: string) => {
    if (this.state.result != null && code !== this.state.code) {
      this.setState({ changed: true });
    }
  };

  remove = () => {
    this.props.dispose?.();
  };

  runCode = async () => {
    try {
      this.setState({ running: true });
      const code = this.editor.current!.code;
      const ast = Compiler.parse_repl(code, "(repl)");
      const ir = Compiler.lower_to_repl(code, ast);
      switch (ir.tag) {
        case IR.ReplTag.DECLARATIONS: {
          for (const x of ir.declarations) {
            await this.props.crochet.load_declaration(x, this.props.module);
          }
          this.setState({
            result: new PEMessage("Ok"),
            changed: false,
            running: false,
          });
          break;
        }

        case IR.ReplTag.STATEMENTS: {
          const env = new Environment(null, null, this.props.module, null);
          const value = await this.props.crochet.run_block(ir.block, env);
          this.setState({
            result: new PEOk(value),
            changed: false,
            running: false,
          });
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.setState({
          result: new PEFail(error.message),
          changed: false,
          running: false,
        });
      } else {
        this.setState({
          result: new PEFail(error),
          changed: false,
          running: false,
        });
      }
    }
  };

  render() {
    return (
      <div
        className="crochet-ui--playground-editor"
        data-changed={this.state.changed}
        data-running={this.state.running}
      >
        <div className="crochet-ui--playground-code-editor">
          <CodeEditor
            ref={this.editor}
            code={this.state.code}
            onChanged={this.codeChanged}
          />
          <Column style="crochet-ui--playground-editor-actions">
            <If test={this.props.dispose != null}>
              <Button onClick={this.remove}>
                <Icon icon="times" />
              </Button>
            </If>

            <Button enabled={!this.state.running} onClick={this.runCode}>
              <Icon icon="play" />
            </Button>
          </Column>
        </div>
        {this.renderResult()}
      </div>
    );
  }

  renderResult() {
    const result = this.state.result;
    if (result == null) {
      return null;
    } else {
      return (
        <div className="crochet-ui--playground-result">
          {this.renderSpecificResult(result)}
        </div>
      );
    }
  }

  renderSpecificResult(result: PEResult) {
    if (result instanceof PEOk) {
      return (
        <div className="crochet-ui--playground-value-result">
          <Value value={result.value} />
        </div>
      );
    } else if (result instanceof PEFail) {
      const message =
        result.error instanceof Error
          ? result.error.stack ?? result.error.message
          : String(result.error);
      return (
        <div className="crochet-ui--playground-error-result">{message}</div>
      );
    } else if (result instanceof PEMessage) {
      return (
        <div className="crochet-ui--playground-message">{result.message}</div>
      );
    } else {
      throw unreachable(result, "Result");
    }
  }
}
