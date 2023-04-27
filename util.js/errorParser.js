const parseErr = error => {
    if (Array.isArray(error)) {
        return {
            messages: error.map(e => e.msg),
            fields: error.reduce((fieldsObj, er) => {
                fieldsObj[er.path] = true
                return fieldsObj
            }, {})
        }
    }
}

function parseOtherErrToExpressValidatorErr(error) {
    if (error.name == 'ValidationError') {
        return Object.values(error.errors).reduce((errArr, { path, message }) => {
            errArr.push({ path, msg: message })
            return errArr
        }, [])
    }
    else {
        return [{ path: undefined, msg: `${error.message}` }]
    }
}

module.exports = {
    parseErr,
    parseOtherErrToExpressValidatorErr
}