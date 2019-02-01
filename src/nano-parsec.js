// Copyright 2019 LuoChen (luochen1990@gmail.com). Licensed under the Apache License 2.0.

// type Parser tok res = [tok] -> Maybe {result: res, rest: [tok]}

// runParser :: (Show t, Show a) => Parser t a -> [t] -> Either String a
const runParser = p => s => {
    const rst = p(s)
    if (rst != null) {
        const {result, rest} = rst
        if (rest.length === 0) {
            return {success: result}
        } else {
            return {failed: "there are tokens not consumed"}
        }
    } else {
        return {failed: "impossible to parse"}
    }
}

// the left bias or
// (<|>) :: Parser t a -> Parser t a -> Parser t a
const orL = p1 => p2 => s => {
    const r = p1(s)
    return (r != null) ? r : p2(s)
}

// satisfy :: (t -> Bool) -> Parser t t
const satisfy = p => s => {
    if (s.length === 0) {
        return null
    } else {
        if (p(s[0])) {
            return {result: s[0], rest: s.slice(1)}
        } else {
            return null
        }
    }
}

// single :: Eq t => t -> Parser t t
const single = c0 => satisfy(c => c === c0)

// anySingle :: Parser t t
const anySingle = s => { return {result: s[0], rest: s.slice(1)} }

// string :: Eq t => [t] -> Parser t [t]
const string = s0 => s => {
    if (startsWith(s0)(s)) {
        return {result: s0, rest: s.slice(s0.length)}
    } else {
        return null
    }
}

// empty :: Parser t a
const empty = s => null

// eof :: Parser t ()
const eof = s => (s.length === 0) ? {result: null, rest: s} : null

// optional :: Parser t a -> Parser t (Maybe a)
const optional = p => s => {
    const r = p(s)
    if (r != null) {
        const {result, rest} = r
        return {result: {just: result}, rest}
    } else {
        return {result: null, rest: s}
    }
}

// many :: Parser t a -> Parser t [a]
const many = p => s => {
    let result = []
    let rest = s
    while (true) {
        let r = p(s)
        if (r == null) {
            break
        } else {
            result.push(r.result)
            rest = r.rest
        }
    }
    return {result, rest}
}

// many1 :: Parser t a -> Parser t [a]
const many1 = p => s => {
    let {result, rest} = many(p)(s)
    return (result.length > 0) ? {result, rest} : null
}

// sepBy1 :: Parser t a -> Parser t b -> Parser t [a]
//TODO const sepBy1 = p => op => {


// sepBy :: Parser t a -> Parser t b -> Parser t [a]
//TODO const sepBy = p => op => {

// ignoreL
// (*>) :: Parser t a -> Parser t b -> Parser t b
//TODO

// ignoreR
// (<*) :: Parser t a -> Parser t b -> Parser t a
//TODO

/////////////////////////    tools    /////////////////////////

// startsWith :: Eq t => [t] -> [t] -> Bool
const startsWith = prefix => s => {
    if (typeof s === 'string') {
        return s.startsWith(prefix)
    } else {
        return s.length >= prefix.length && (prefix.every((c, i) => s[i] === c))
    }
}

const compose = f => g => x => f(g(x))

// type Maybe a = null | {just: a}

