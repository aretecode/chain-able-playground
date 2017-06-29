import {types as t} from 'mobx-state-tree'

// const DEFAULT_CODE = `import React from "react"
// import { types } from "mobx-state-tree"
// import { observer } from "mobx-react"
// import { inspect, render } from "mobx-state-tree-playground"
//
// const AppModel = types.model({
//     count: types.optional(types.number, 0)
// }, {
//     increment(){
//         this.count++
//     },
// 	decrement() {
// 		this.count--
// 	}
// })
//
// const store = AppModel.create()
// inspect(store)
//
// const App = observer(
//     props => <div>
//         My awesome counter:
//         <button onClick={() => props.store.decrement()}>-</button>
//         {props.store.count}
//         <button onClick={() => props.store.increment()}>+</button>
//     </div>
// )
//
// render(<App store={store} />)
// `

const DEFAULT_TRIM = `
  // import React from "react"
  // import { types } from "mobx-state-tree"
  // import { observer } from "mobx-react"
  // import { inspect, render } from "mobx-state-tree-playground"
  //
  // const AppModel = types.model({count: types.optional(types.number, 0)}, {
  //   increment() {
  //     this.count++
  //   },
  // 	decrement() {
  // 		this.count--
  // 	}
  // })
  // const store = AppModel.create()
  // inspect(store)
  //
  // const App = observer(
  //     props => <div>
  //         My awesome counter:
  //         <button onClick={() => props.store.decrement()}>-</button>
  //         {props.store.count}
  //         <button onClick={() => props.store.increment()}>+</button>
  //     </div>
  // )
  // render(<App store={store} />)
`
const NEWLINE = '\\n----'
const log = `
const str = obj => JSON.stringify(obj, null, 2)
  .replace(/[\{\}]|(\s+\[)|(\])(?:,)|[,]/g, '')
  .replace(/( {2}\])/g, '')

const log = obj => console.log(str(obj), '${NEWLINE}')
`
let MERGE_CODE = `
const Chainable = require('chain-able')

${log}

const chain = new Chain()
chain.extend(['eh', 'nudder']).observe(['eh', 'n*dder'], data => log(data))

chain.eh(Date.now()).nudder('canada')

chain.merge({
  eh: {merged: true},
  lula: 100,
  arr: [-Infinity, +Infinity],
})

`
let DEFAULT_CODE = MERGE_CODE

// @TODO make editor compile this grr
const DECORATOR_CODE = `
import {
  chainMethods,
  decorator,
  observe,
  transform,
  remap,
  schema,
  compose,
} from 'chain-able/src/compose/decorators'

@schema({
  enabled: 'boolean',
  data: '!string',
  name: '?string',
  location: 'number|number[]',
  dates: {
    created: {
      at: 'date',
    },
  },
})
class CommentChain {
  onInvalid(error, arg, instance) {
    console.log({error, arg, instance})
  }
  onValid(key, arg) {
    console.log({[key]: arg})
  }
}

const commentChain = new CommentChain()
commentChain.enabled(true)
commentChain.data(!'bool')
commentChain.name('string')
commentChain.name(['strings!'])
commentChain.name(['? is optional :-)'])
`

// @NOTE: .onInvalid with key as first arg isn't published yet
// .onValid((key, arg, instance) => console.log(arg, two))
// .onSet(arg => console.log('onset...'))
// .onCall(arg => console.log({arg}))

let SCHEMA_CODE = `
const Chain = require('chain-able')

${log}
const commentChain = new Chain()

commentChain
  .methods()
  .onValid((key, arg) => log({[key]: arg}))
  .onInvalid((error, arg, instance) =>
    log({error}) && log({arg}) && log({instance}
  ))
  .getSet()
  .schema({
    enabled: 'boolean',
    data: '!string',
    name: '?string',
    location: 'number|number[]',
    dates: {
      created: {
        at: 'date',
      },
    },
  })

commentChain.setEnabled(true)
commentChain.setData(!'bool')
commentChain.setName('string')
commentChain.setName(['strings!'])
commentChain.setName(['? is optional :-)'])
`

DEFAULT_CODE = SCHEMA_CODE

let LS_CODE = `
// just a mock for node
const store = {}
const storage = {
  getItem: key => store[key],
  setItem: (key, value) => (store[key] = value),
}
const ls = {
  get: key => JSON.parse(storage.getItem(key)),
  set: (key, value) => storage.setItem(key, JSON.stringify(value)),
}

// important code
const {Chain, eq} = require('chain-able')

class Canada extends Chain {
  constructor(parent) {
    super(parent)
    this.extend(['eh'])
  }
}

const canada = new Canada()
  .eh('eh!')
  .merge({canada: true})
  .tap('canada', value => '🇨🇦')
  .setIfEmpty('ooo', 'ahh')

ls.set('canada', canada.entries())
const hydrated = new Canada().from(ls.get('canada'))

const hydratedIsTheSame = eq(canada.entries(), hydrated.entries())
console.log(hydratedIsTheSame)
`

let OBSERVE_CODE = `
const {compose, Chain} = require('chain-able')

class Winning {}
class Yes extends compose(Winning) {
  get winning() {
    return true
  }
}
const yes = new Yes()
console.log('winning?', yes instanceof Winning, yes.winning)
console.log('won ---')

const chain = new Chain()

chain
  .extend(['eh'])
  .observe('e*', data => Object.keys(data).map(key => console.log(key, data[key])))

chain.eh('yay!')

// only once
chain.eh('same')
chain.eh('same')
chain.eh('same')
chain.eh('same')
chain.eh('same')
`

const AppStore = t.model(
  {
    code: t.string,
    previewMode: t.union(
      ...['react', 'snapshots', 'patches', 'actions'].map(t.literal)
    ),
    snapshots: t.array(t.frozen),
    patches: t.array(t.frozen),
    actions: t.array(t.frozen),
    logs: t.array(t.string),

    currentPreviewIndex: t.number,

    get currentPreview() {
      return this.previewMode !== 'react' &&
        this[this.previewMode].length > 0 &&
        this[this.previewMode].length > this.currentPreviewIndex
        ? JSON.stringify(
            this[this.previewMode][this.currentPreviewIndex],
            null,
            4
          )
        : null
    },

    get previewCount() {
      return this.previewMode === 'react' ? 0 : this[this.previewMode].length
    },

    get shareUrl() {
      return 'src=' + encodeURIComponent(this.code)
    },
  },
  {
    setCode(code) {
      this.code = code
    },
    showExample(name) {
      if (name === 'merge') {
        this.setCode(MERGE_CODE)
      } else if (name === 'ls') {
        this.setCode(LS_CODE)
      } else if (name === 'observe') {
        this.setCode(OBSERVE_CODE)
      } else if (name === 'schema') {
        this.setCode(SCHEMA_CODE)
      }
      return true
    },
    setPreviewMode(mode) {
      this.currentPreviewIndex = 0
      this.previewMode = mode
      this.goLast()
    },

    goFirst() {
      this.currentPreviewIndex = 0
    },
    goLast() {
      this.currentPreviewIndex = this.previewCount > 0
        ? this.previewCount - 1
        : 0
    },
    goPrevious() {
      this.currentPreviewIndex = this.currentPreviewIndex > 0
        ? this.currentPreviewIndex - 1
        : 0
    },
    goNext() {
      this.currentPreviewIndex = this.currentPreviewIndex >=
        this.previewCount - 1
        ? this.previewCount - 1
        : this.currentPreviewIndex + 1
    },
    clear() {
      this.currentPreviewIndex = 0
      this.snapshots = []
      this.patches = []
      this.actions = []
      this.logs = []
    },
    addSnapshot(snapshot) {
      this.snapshots.push(snapshot)
      this.goLast()
    },
    addPatch(patch) {
      this.patches.push(patch)
      this.goLast()
    },
    addAction(action) {
      this.actions.push(action)
      this.goLast()
    },
    addLog(log) {
      this.logs.push(log)
    },
  }
)

let code = window.location.hash.indexOf('src=') > 0
  ? decodeURIComponent(
      window.location.hash.substring(
        window.location.hash.indexOf('src=') + 'src='.length
      )
    )
  : DEFAULT_CODE

export default AppStore.create({
  code,
  previewMode: 'snapshots',
  currentPreviewIndex: 0,
  snapshots: [],
  patches: [],
  actions: [],
  logs: [],
})
