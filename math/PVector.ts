/// <reference path="../core/Processing"/>

namespace pjs.math {
  "use strict"

  import PConstants = core.PConstants
  import InjectInto = utils.InjectInto

  const {lerp, sq, isZero} = Maths,
        TAU = PConstants.TAU,
        argsErr = (mtd: string, len: number, min: number) => {
          throw `Too few args passed to ${mtd}() [${len} < ${min}].`
        },
        xyzObjCheck = (obj: {} | none): obj is xyzObj  => obj != null && 'z' in obj,
        pjsCheck    = (obj: {} | none): obj is PApplet => obj != null && 'random' in obj

  @InjectInto(PApplet) export class PVector implements Comparable<xyzObj>, Cloneable {
    constructor (public x: coord = 0, public y: coord = 0, public z: coord = 0) {}

    static fromAngle(angle: rad, target?: PVector) {
      return target && target.set (Math.cos(angle), Math.sin(angle))
                    || new PVector(Math.cos(angle), Math.sin(angle))
    }

    static random2D(target?: PVector | PApplet, parent?: PApplet) {
      const isPjs = pjsCheck(target),
            rnd = parent? parent : isPjs && target as PApplet || Math
      return PVector.fromAngle(TAU * rnd.random(), isPjs? void 0 : target as PVector)
    }

    static random3D(target?: PVector | PApplet, parent?: PApplet) {
      const isPjs = pjsCheck(target),
            rnd = parent? parent : isPjs && target as PApplet || Math,
            ang = TAU * rnd.random(),
            vz  = 2 * rnd.random() - 1,
            vzr = Math.sqrt(1 - vz*vz),
            vx  = vzr * Math.cos(ang),
            vy  = vzr * Math.sin(ang)
      return target && !isPjs? (target as PVector).set(vx, vy, vz) : new PVector(vx, vy, vz)
    }

    static dist(v1: xyzObj, v2: xyzObj) {
      return Math.sqrt(PVector.distSq(v1, v2))
    }

    static distSq(v1: xyzObj, v2: xyzObj) {
      return sq(v1.x - v2.x) + sq(v1.y - v2.y) + sq(v1.z - v2.z)
    }

    static dot(v1: xyzObj, v2: xyzObj) {
      return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z
    }

    static cross(v1: xyzObj, v2: xyzObj, target?: PVector) {
      const cx: coord = v1.y*v2.z - v2.y*v1.z,
            cy: coord = v1.z*v2.x - v2.z*v1.x,
            cz: coord = v1.x*v2.y - v2.x*v1.y
      return target && target.set(cx, cy, cz) || new PVector(cx, cy, cz)
    }

    static angleBetween(v1: PVector, v2: PVector,
                        magSq1?: number, magSq2?: number, dot?: number): rad {
      if (v1.isZero() || v2.isZero())  return 0
      //if (!v1.x && !v1.y && !v1.z || !v2.x && !v2.y && !v2.z)  return 0
      magSq1 = magSq1 || v1.magSq(), magSq2 = magSq2 || v2.magSq()
      dot = dot || PVector.dot(v1, v2)
      const amt = dot / Math.sqrt(magSq1 * magSq2)
      return amt <= -1? Math.PI : amt >= 1? 0 : Math.acos(amt)
    }

    static lerp(v1: PVector, v2: PVector, amt: norm, target?: PVector) {
      return (target && target.set(v1) || v1.clone()).lerp(v2, amt)
    }

    static add(v1: xyzObj, v2: xyzObj, target?: PVector) {
      return target && target.set (v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
                    || new PVector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }

    static sub(v1: xyzObj, v2: xyzObj, target?: PVector) {
      return target && target.set (v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
                    || new PVector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    }

    static subInv(v1: xyzObj, v2: xyzObj, target?: PVector) {
      return target && target.set (v2.x - v1.x, v2.y - v1.y, v2.z - v1.z)
                    || new PVector(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z)
    }

    static mult(v: xyzObj, n: xyzObj | number, target?: PVector) {
      if (typeof n == 'object')  return target && target.set (v.x*n.x, v.y*n.y, v.z*n.z)
                                               || new PVector(v.x*n.x, v.y*n.y, v.z*n.z)
      else                       return target && target.set (v.x*n,   v.y*n,   v.z*n)
                                               || new PVector(v.x*n,   v.y*n,   v.z*n)
    }

    static div(v: xyzObj, n: xyzObj | number, target?: PVector) {
      if (typeof n == 'object')  return target && target.set (v.x/n.x, v.y/n.y, v.z/n.z)
                                               || new PVector(v.x/n.x, v.y/n.y, v.z/n.z)
      else                       return target && target.set (v.x/n,   v.y/n,   v.z/n)
                                               || new PVector(v.x/n,   v.y/n,   v.z/n)
    }

    static mod(v: xyzObj, n: xyzObj | number, target?: PVector) {
      if (typeof n == 'object')  return target && target.set (v.x%n.x, v.y%n.y, v.z%n.z)
                                               || new PVector(v.x%n.x, v.y%n.y, v.z%n.z)
      else                       return target && target.set (v.x%n,   v.y%n,   v.z%n)
                                               || new PVector(v.x%n,   v.y%n,   v.z%n)
    }

    static compare(a: xyzObj, b: xyzObj) { return a.x - b.x || a.y - b.y || a.z - b.z }
    compareTo(v: xyzObj) { return this.x - v.x || this.y - v.y || this.z - v.z }

    array()   { return [ this.x, this.y, this.z ] as xyz }
    object()  { return { x: this.x, y: this.y, z: this.z } }
    clone()   { return new PVector(this.x, this.y, this.z) }

    get(): PVector // @Deprecated
    get(target: number[] | null): xyz
    get(target: TypedArray): TypedArray
    get(target: ArrayLike<number>): PseudoArray<number>
    get(target: xyzObj): xyzObj
    get(target?: PseudoArray<number> | xyzObj | null): ArrayLike<number> | xyzObj {
      if      (!target)               return target === void 0 && this.clone() || this.array()
      else if (xyzObjCheck(target))   target.x  = this.x, target.y  = this.y, target.z  = this.z
      else                            target[0] = this.x, target[1] = this.y, target[2] = this.z
      return target
    }

    set(v: ArrayLike<number> | xyzObj | coord, y?: coord, z?: coord) {
      if (y != void 0)  this.x = +v, this.y = +y, z != void 0 && (this.z = +z)
      else              this.set(v[0] || (v as xyzObj).x || 0,
                                 v[1] || (v as xyzObj).y || 0,
                                 v[2] || (v as xyzObj).z)
      return this
    }

    normalize(target?: PVector, mag?: number): this | PVector {
      const m = mag || this.mag(),
            canDivide = m != 0 && m != 1
      if (!arguments.length)  return canDivide && this.div(m) || this
      return canDivide? PVector.div(this, m, target)
                      : target && target.set(this) || this.clone()
    }

    limit(max: number, target?: PVector, magSq?: number): this | PVector {
      magSq = magSq || this.magSq()
      return magSq > max*max? this.normalize(target, Math.sqrt(magSq)).mult(max)
                            : target && target.set(this) || this
    }

    heading(): rad {
      //return -Math.atan2(-this.y, this.x)
      return Math.atan2(this.y, this.x)
    }

    mag() {
      return Math.sqrt(this.magSq())
    }

    magSq() {
      //return sq(this.x) + sq(this.y) + sq(this.z)
      return this.x*this.x + this.y*this.y + this.z*this.z
    }

    setMag(target: PVector | number, length?: number, mag?: number): this | PVector {
      return typeof target == 'object'? this.normalize(target, mag).mult(length!)
                                      : this.normalize().mult(target)
    }

    rotate(angle: rad, target?: PVector): this | PVector {
      const c = Math.cos(angle),
            s = Math.sin(angle),
            x = c*this.x - s*this.y,
            y = s*this.x + c*this.y
      return target && target.set(x, y) || this.set(x, y)
    }

    rotateX(angle: rad, target?: PVector): this | PVector {
      const c = Math.cos(angle),
            s = Math.sin(angle),
            y = c*this.y - s*this.z,
            z = s*this.y + c*this.z
      return target && target.set(this.x, y, z) || this.set(this.x, y, z)
    }

    rotateY(angle: rad, target?: PVector): this | PVector {
      const c = Math.cos(angle),
            s = Math.sin(angle),
            x = s*this.z + c*this.x,
            z = c*this.z - s*this.x
      return target && target.set(x, this.y, z) || this.set(x, this.y, z)
    }

    fromAngle(angle: rad, target?: PVector): this | PVector {
      return PVector.fromAngle(angle, target || this)
    }

    random2D(target?: PVector | PApplet, parent?: PApplet): this | PVector {
      return pjsCheck(target) && PVector.random2D(this, target)
                              || PVector.random2D(target || this, parent)
    }

    random3D(target?: PVector | PApplet, parent?: PApplet): this | PVector {
      return pjsCheck(target) && PVector.random3D(this, target)
                              || PVector.random3D(target || this, parent)
    }

    dist(v1: xyzObj, v2?: xyzObj) {
      return v2 && PVector.dist(v1, v2) || PVector.dist(this, v1)
    }

    distSq(v1: xyzObj, v2?: xyzObj) {
      return v2 && PVector.distSq(v1, v2) || PVector.distSq(this, v1)
    }

    dot(v: xyzObj | number, y?: xyzObj | number, z?: number) {
      return typeof v != 'object'? this.x*v + this.y*+y + this.z*z :
             y == void 0? PVector.dot(this, v) : PVector.dot(v, y as xyzObj)
    }

    cross(v1: xyzObj, v2?: PVector, target?: PVector): this | PVector {
      return target && PVector.cross(v1, v2!, target) || PVector.cross(this, v1, v2)
    }

    angleBetween(v: PVector, magSq1?: number, magSq2?: number, dot?: number) {
      return PVector.angleBetween(this, v, magSq1, magSq2, dot)
    }

    lerp(a: PVector | number, b: PVector | number, c?: number, d?: norm): this | PVector {
      let x: number, y: number, z: number, amt: norm
      const len = arguments.length
      if ((len | 1) == 1)  argsErr('lerp', len, 2)
      if (len == 2) { // given vector and amt
        const v = a as PVector
        x = v.x, y = v.y, z = v.z
        amt = b as norm
      } else if (len == 3) { // given vector 1, vector 2 and amt
        return PVector.lerp(a as PVector, b as PVector, c!)
      } else { // given x, y, z and amt
        x = a as number, y = b as number, z = c!, amt = d!
      }
      return this.set(lerp(this.x, x, amt), lerp(this.y, y, amt), lerp(this.z, z, amt))
    }

    add(v: xyzObj | number, y?: xyzObj | number, z?: PVector | number): this | PVector {
      if (y != undefined) {
        if (typeof y == 'object')       return PVector.add(v as xyzObj, y, z as PVector)
        this.x += +v, this.y += y, z != void 0 && (this.z += +z)
      } else if (typeof v == 'object')  this.x += v.x, this.y += v.y, this.z += v.z
        else                            this.x += v,   this.y += v,   this.z += v
      return this
    }

    sub(v: xyzObj | number, y?: xyzObj | number, z?: PVector | number): this | PVector {
      if (y != undefined) {
        if (typeof y == 'object')       return PVector.sub(v as xyzObj, y, z as PVector)
        this.x -= +v, this.y -= y, z != void 0 && (this.z -= +z)
      } else if (typeof v == 'object')  this.x -= v.x, this.y -= v.y, this.z -= v.z
        else                            this.x -= v,   this.y -= v,   this.z -= v
      return this
    }

    subInv(v: xyzObj | number, y?: xyzObj | number, z?: PVector | number): this | PVector {
      if (y != undefined) {
        if (typeof y == 'object')  return PVector.subInv(v as xyzObj, y, z as PVector)
        this.x = +v - this.x, this.y = y - this.y, z != void 0 && (this.z = +z - this.z)
      } else if (typeof v == 'object')
          this.x = v.x - this.x, this.y = v.y - this.y, this.z = v.z - this.z
        else
          this.x = v   - this.x, this.y = v   - this.y, this.z = v   - this.z
      return this
    }

    mult(v: xyzObj | number, n?: number, target?: PVector): this | PVector {
      if (n != undefined)        return PVector.mult(v as xyzObj, n, target)
      if (typeof v == 'object')  this.x *= v.x, this.y *= v.y, this.z *= v.z
      else                       this.x *= v,   this.y *= v,   this.z *= v
      return this
    }

    div(v: xyzObj | number, n?: number, target?: PVector): this | PVector {
      if (n != undefined)        return PVector.div(v as xyzObj, n, target)
      if (typeof v == 'object')  this.x /= v.x, this.y /= v.y, this.z /= v.z
      else                       this.x /= v,   this.y /= v,   this.z /= v
      return this
    }

    mod(v: xyzObj | number, n?: number, target?: PVector): this | PVector {
      if (n != undefined)        return PVector.mod(v as xyzObj, n, target)
      if (typeof v == 'object')  this.x %= v.x, this.y %= v.y, this.z %= v.z
      else                       this.x %= v,   this.y %= v,   this.z %= v
      return this
    }

    negate() {
      this.x *= -1, this.y *= -1, this.z *= -1
      return this
    }

    clear() {
      this.x = this.y = this.z = 0
      return this
    }

    isZero(tolerance?: norm) {
      return isZero(this.x, tolerance) && isZero(this.y, tolerance) && isZero(this.z, tolerance)
    }

    isNaN() { return this.x != this.x || this.y != this.y || this.z != this.z }
    toString() { return `[ ${this.x}, ${this.y}, ${this.z} ]` }
    valueOf() { return this.hashCode() }

    equals(o: Object) {
      return o == this? true : o instanceof PVector &&
             o.x == this.x && o.y == this.y && o.z == this.z
    }

    hashCode() {
      let hash = 1
      hash = 31*hash + this.x
      hash = 31*hash + this.y
      return 31*hash + this.z
    }
  }

  export interface PVector {
    copy(): PVector
    heading2D(): rad // @Deprecated
    rotateZ(angle: rad, target?: PVector): this | PVector
  }

  PVector.prototype.copy = PVector.prototype.clone
  PVector.prototype.heading2D = PVector.prototype.heading
  PVector.prototype.rotateZ = PVector.prototype.rotate

  export declare class PVectorAlt extends PVector {}

  export function PVectorAltBuilder(p: PApplet) {
    "use strict"

    const {DEG_TO_RAD, RAD_TO_DEG} = PConstants

    return class PVectorAlt extends PVector {
      static fromAngle(angle: rad, target?: PVector) {
        p._degreeIn && (angle *= DEG_TO_RAD)
        return target && target.set(Math.cos(angle), Math.sin(angle))
                      || new PVectorAlt(Math.cos(angle), Math.sin(angle))
      }

      fromAngle(angle: rad, target?: PVector): this | PVector {
        return PVectorAlt.fromAngle(angle, target || this)
      }
    } as typeof PVectorAlt
  }
}
