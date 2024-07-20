import {traverseTree} from 'ajv-errors-to-data-tree/src/helpers.js'
import * as m from './messages.js'

function isValidBadInputTree(tree) {
    if (!Array.isArray(tree.errors) && !tree.node) return false
    
    try {
        traverseTree(tree, (e) => {
            // console.log("isValidBadInputTree, traversingTree, e:", e);
            const badReqErrs = [(e) => m.FieldMissing.code === e.code, (e) => m.TypeErrorMsg.code === e.code, (e) => m.EmptyError.code === e.code, (e) => m.ValidationError.code === e.code]

            if (!badReqErrs.map(isE => isE(e)).includes(true)) {
                // console.log("isValidBadInputTree, traversingTree, e is not a badReqErr, e:", e);
                throw m.InvalidErrorFormat.create()
            }
        })
    } catch (e) {
        if (m.InvalidErrorFormat.code !== e.code) throw e
        // console.log("isValidBadInputTree, traverseTree thrown, e:", e)
        return false
    }

    return true
}

export {isValidBadInputTree}
