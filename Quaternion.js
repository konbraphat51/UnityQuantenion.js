/**
 * Full Scratch UnityEngine.Quaternion implementation
 *
 * Writer: https://github.com/konbraphat51
 */

/**
 * @constructor Make a new Quaternion instance
 * @classdesc Quaternion class, immitating UnityEngine.Quaternion
 * @param {number} x 0th element of the quaternion. Don't set this value.
 * @param {number} y 1st element of the quaternion. Don't set this value.
 * @param {number} z 2nd element of the quaternion. Don't set this value.
 * @param {number} w 3rd element of the quaternion. Don't set this value.
 * @see https://docs.unity3d.com/ja/2023.2/ScriptReference/Quaternion.html
 */
class Quaternion {
    //description above
    constructor(x, y, z, w) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    /**
     * @description Returns or sets the euler angle representation of the rotation in degrees.
     * @see https://docs.unity3d.com/2023.2/Documentation/ScriptReference/Quaternion-eulerAngles.html
     * @returns {number[]} [Roll, Pitch, Yaw] in degrees
     */
    get eulerAngles() {

    }

    /**
     * @description Returns Hamilton product of two quaternions. 
     * Meaning that the rotation of q0 is applied first, then q1.
     * @param {Quaternion} q0 Quaternion to be applied first
     * @param {Quaternion} q1 Quaternion to be applied second
     * @returns 
     */
    static Multiply(q0, q1) {
        return new Quaternion(
            q0.w * q1.x + q0.x * q1.w + q0.y * q1.z - q0.z * q1.y,
            q0.w * q1.y - q0.x * q1.z + q0.y * q1.w + q0.z * q1.x,
            q0.w * q1.z + q0.x * q1.y - q0.y * q1.x + q0.z * q1.w,
            q0.w * q1.w - q0.x * q1.x - q0.y * q1.y - q0.z * q1.z
        )
    }

    get _norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }

    _IsZero(x) {
        return this.norm < 0.00001
    }
}