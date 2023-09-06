'use strict'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { compare_files } from '../../functions/tc-sign/helpers/common.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('TrustCenter::Class', () => {
    describe('Class File Comparison', () => {
        it('all class file contents are comparable', () => {
            const file_one = path.join(__dirname, '../../functions/tc-sign/helpers/classes/TrustCenter.mjs')
            const file_two = path.join(__dirname, '../../functions/tc-verify/helpers/classes/TrustCenter.mjs')

            expect(compare_files(file_one, file_two)).to.equal(true)
        })
    })
})
