import main from './index.js'

const args = process.argv.slice(2)
if (args.length < 3) throw new Error("all three arguments are required")

main(args.shift(), args.shift(), args.shift())