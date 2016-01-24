type falsy   = boolean
type truthy  = boolean

type char    = string
type url     = string

type int8    = number
type int16   = number
type int32   = number
type int64   = number
type uint8   = number
type uint16  = number
type uint32  = number
type uint64  = number
type float32 = number
type float64 = number

type byte    = int8
type ubyte   = uint8
type short   = int16
type ushort  = uint16
type int     = int32
type uint    = uint32
type long    = int64
type ulong   = uint64
type float   = float32
type double  = float64

declare const enum coord {}
declare const enum size {}
declare const enum pct {}

declare const enum ang {}
declare const enum rad {}
declare const enum deg {}

type xy  = [coord, coord]
type xyz = [coord, coord, coord]
type wh  = [size, size]
type whd = [size, size, size]

type callback = () => void

class Processing extends Maths {
  constructor() { super() }
  static PVector = pjs.classes.PVector
}

interface Processing extends Processing.prototype {}

namespace Processing {
  export interface prototype {
    PVector: typeof pjs.classes.PVector
  }
}

Processing.prototype.PVector = Processing.PVector