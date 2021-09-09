const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const Ajv = require('ajv/dist/2020')
const addFormats = require('ajv-formats')
const SCHEMA = require('./schema.json')

const ajv = new Ajv({
  allowUnionTypes: true,
  strict: true,
  strictTypes: true,
  strictTuples: true,
  validateSchema: true,
  validateFormats: true,
  allErrors: true
})

addFormats(ajv)

/*
 * Validate the data against the schema
 */
const validateFunction = ajv.compile(SCHEMA)
console.error('Reading YAML data file...')
const DATA = yaml.load(fs.readFileSync(path.resolve(__dirname, 'data.yaml'), 'utf8'))
console.error('Validating the data against the schema...')
if (!validateFunction(DATA)) {
  console.error('Validation failed')
  for (const error of validateFunction.errors) {
    console.error(`- [${error.instancePath}]: ${error.message}`)
  }
  process.exit(1)
}
