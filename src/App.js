import React, {Component} from 'react'
import MonacoEditor from 'react-monaco-editor'
import {observer} from 'mobx-react'
import {runCode} from './run'
import log from './fliplog'

class App extends Component {
  editor = null
  viewer = null
  state = {preview: null}

  resize = () => {
    if (this.editor) {
      this.editor.layout()
    }
    if (this.viewer) {
      this.viewer.layout()
    }
  }

  editorDidMount = (editor, monaco) => {
    this.editor = editor
    this.resize()
  }

  // https://codepen.io/ImagineProgramming/post/design-patterns-wrapping-things-with-the-decorator-pattern
  // https://raw.githubusercontent.com/Microsoft/monaco-typescript/master/src/monaco.d.ts
  // https://github.com/Microsoft/monaco-editor/issues/111
  editorWillMount = monaco => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
    })

    // I don't think the following makes any difference
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      // jsx: 'react',
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      allowNonTsExtensions: true,
      allowJs: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      preserveConstEnums: true,
      target: monaco.languages.typescript.ScriptTarget.Latest,
    })
  }

  viewerDidMount = (editor, monaco) => {
    this.viewer = editor
    this.resize()
  }

  componentDidMount() {
    window.onresize = this.resize
    runCode(this.props.store, this.sandboxRender)
  }

  sandboxRender = element => {
    this.setState({preview: element})
  }

  render() {
    const {store} = this.props
    this.runner = () => runCode(store, this.sandboxRender)
    return (
      <div className="playground">
        <div className="toolbar">
          <div className="buttons run-code">
            <button onClick={() => this.runner()}>
              Run ►
            </button>
            <button onClick={() => (window.location.hash = store.shareUrl)}>
              Share (copy url)
            </button>
          </div>
          {store.previewMode !== 'react'
            ? <div className="buttons preview-navigation">
                <button onClick={store.goFirst}>
                  ⇤
                </button>
                <button onClick={store.goPrevious}>
                  ←
                </button>
                <span>
                  {store.previewCount > 0 ? store.currentPreviewIndex + 1 : 0}
                  {' '}
                  of
                  {' '}
                  {store.previewCount}
                </span>
                <button onClick={store.goNext}>
                  →
                </button>
                <button onClick={store.goLast}>
                  ⇥
                </button>
              </div>
            : null}
          <div className="buttons preview-mode">
            <button
              className={store.previewMode === 'observe' ? 'active' : ''}
              onClick={() => store.showExample('observe')}
            >
              Observe
              {/* Preview */}
            </button>
            <button
              className={store.previewMode === 'schema' ? 'active' : ''}
              onClick={() => store.showExample('schema')}
            >
              Schema
              {/* Snapshots */}
            </button>

            <button
              className={store.previewMode === 'patches' ? 'active' : ''}
              onClick={() => store.showExample('merge') && this.runner()}
            >
              Merge
              {/* Patches */}
            </button>

            <button
              className={store.previewMode === 'actions' ? 'active' : ''}
              onClick={() => store.showExample('ls') && this.runner()}
            >
              LocalStorage
              {/* Actions */}
            </button>
          </div>
        </div>
        <div className="code">
          <MonacoEditor
            width="100%"
            height="100%"
            language="typescript"
            value={store.code}
            onChange={store.setCode}
            editorWillMount={this.editorWillMount}
            editorDidMount={this.editorDidMount}
          />
        </div>
        <div className="preview">
          {store.previewMode === 'react'
            ? this.state.preview
            : store.currentPreview === null
              ? null
              : <MonacoEditor
                  language="json"
                  value={store.currentPreview}
                  options={{readOnly: true}}
                  editorDidMount={this.viewerDidMount}
                />}
          {store.logs.length > 0
            ? <div className="logs">
                {store.logs.map(item =>
                  <div>{item.split('\n').map(t => <p>{t}</p>)}</div>
                )}
              </div>
            : null}
        </div>
      </div>
    )
  }
}

export default observer(App)
