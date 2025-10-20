import crypto from 'crypto'

const salt = 'cns'

export function hash(password: string) {
    const hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    return hash.digest('hex')
}
