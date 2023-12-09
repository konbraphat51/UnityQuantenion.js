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
     *  The order is Z-rotaion -> Y-rotation -> X-rotation.
     * @see https://docs.unity3d.com/2023.2/Documentation/ScriptReference/Quaternion-eulerAngles.html
     * @returns {number[]} [Roll, Pitch, Yaw] in degrees
     */
    get eulerAngles() {
        //based on https://qiita.com/aa_debdeb/items/3d02e28fb9ebfa357eaf#%E5%9B%9E%E8%BB%A2%E9%A0%86zyx-3

        let pitch = Math.asin(-2 * (this.x * this.z - this.y * this.w))

        let row, yaw
        if (Math.cos(this.y) == 0) {
            row = 0
            yaw = Math.atan(- 2 * (this.x * this.y - this.z * this.w) / (2 * (this.w * this.w + this.y * this.y) - 1))
        } else {
            row = Math.atan(2 * (this.y * this.z + this.x * this.w) / (2 * (this.w * this.w + this.z * this.z) - 1))
            yaw = Math.atan(2 * (this.y * this.x + this.z * this.w) / (2 * (this.w * this.w + this.x * this.x) - 1))
        }

        //to degrees
        pitch = Quaternion.#ConvertToDegrees(pitch)
        row = Quaternion.#ConvertToDegrees(row)
        yaw = Quaternion.#ConvertToDegrees(yaw)

        return [row, pitch, yaw]
    }

    /**
     * @description Returns the norm=1 quaternion that represents the same rotation.
     * @returns {Quaternion} Normalized quaternion
     */
    get normalized() {
        const norm = this.#norm
        return new Quaternion(this.x / norm, this.y / norm, this.z / norm, this.w / norm)
    }

    /**
     * @description Set x, y, z and w components of an existing Quaternion.
     * @param {number} x 0th element of the quaternion 
     * @param {number} y 1st element of the quaternion 
     * @param {number} z 2nd element of the quaternion 
     * @param {number} w 3rd element of the quaternion
     * @returns {void}
     */
    Set(x, y, z, w) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    SetFromToRotation(fromDirection, toDirection) {
        //TODO
    }

    SetLookRotation(view, up) {
        //TODO
    }

    /**
     * @description Converts a rotation to angle-axis representation (angles in degrees).
     * @returns { [number, number[]] } [Angle, Axis] in degrees
     */
    ToAngleAxis() {
        //based on https://qiita.com/aa_debdeb/items/3d02e28fb9ebfa357eaf#%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E8%A7%92%E3%81%8B%E3%82%89%E3%82%AF%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%8B%E3%82%AA%E3%83%B3

        let angle = 2 * Math.acos(this.w)

        let sin_half = Math.sin(angle / 2)
        let axis = [this.x / sin_half, this.y / sin_half, this.z / sin_half]

        //to degrees
        angle = Quaternion.#ConvertToDegrees(angle)

        return [angle, axis]
    }

    /**
     * @description Returns a nicely formatted string of the Quaternion. Defaults to five digits displayed
     * @param {number} [digits=5] Number of digits to display
     * @returns {string} Formatted string "(x, y, z, w)"
    */
    ToString(digits = 5) {
        return `(${this.x.toFixed(digits)}, ${this.y.toFixed(digits)}, ${this.z.toFixed(digits)}, ${this.w.toFixed(digits)})`
    }

    /**
     * @description Returns product of two quaternions. 
     * Meaning that the rotation of q0 is applied first, then q1.
     * @param {Quaternion} q0 Quaternion to be applied first
     * @param {Quaternion} q1 Quaternion to be applied second
     * @returns 
     */
    static Multiply(q0, q1) {
        //based on https://www.mesw.co.jp/business/report/pdf/mss_18_07.pdf
        return new Quaternion(
            q0.x * q1.x - q0.y * q1.y - q0.z * q1.z - q0.w * q1.w,
            q0.y * q1.x + q0.x * q1.y - q0.w * q1.z + q0.z * q1.w,
            q0.z * q1.x + q0.w * q1.y + q0.x * q1.z - q0.y * q1.w,
            q0.w * q1.x - q0.z * q1.y + q0.y * q1.z + q0.x * q1.w
        )
    }

    /**
     * @description Returns the angle in degrees between two rotations a and b.
     * @param {Quaternion} a quanternion
     * @param {Quaternion} b quanternion
     * @see https://docs.unity3d.com/ScriptReference/Quaternion.Angle.html
     */
    static Angle(a, b) {
        //get both axises
        let temp = a.ToAngleAxis()
        let axis_a = temp[1]
        temp = b.ToAngleAxis()
        let axis_b = temp[1]

        //normalize both axises
        const norm_a = Math.sqrt(axis_a[0] * axis_a[0] + axis_a[1] * axis_a[1] + axis_a[2] * axis_a[2])
        axis_a = [axis_a[0] / norm_a, axis_a[1] / norm_a, axis_a[2] / norm_a]
        const norm_b = Math.sqrt(axis_b[0] * axis_b[0] + axis_b[1] * axis_b[1] + axis_b[2] * axis_b[2])
        axis_b = [axis_b[0] / norm_b, axis_b[1] / norm_b, axis_b[2] / norm_b]

        //calculate angle between 2 axis vectors
        let angle = Math.acos(axis_a[0] * axis_b[0] + axis_a[1] * axis_b[1] + axis_a[2] * axis_b[2])
        angle = Quaternion.#ConvertToDegrees(angle)

        return angle
    }

    /**
     * @description Creates a rotation which rotates angle degrees around axis.
     * @param {number} angle rotation in degrees rotated in axis
     * @param {number[]} axis axis vector
     * @returns {Quaternion} Quaternion made
     */
    static AngleAxis(angle, axis) {
        //based on https://qiita.com/aa_debdeb/items/3d02e28fb9ebfa357eaf#%E3%82%AF%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%8B%E3%82%AA%E3%83%B3%E3%81%8B%E3%82%89%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E8%A7%92%E3%81%B8
        const rad = Quaternion.#ConvertToRad(angle)
        const sin_half = Math.sin(rad / 2)
        const cos_half = Math.cos(rad / 2)

        const x = axis[0] * sin_half
        const y = axis[1] * sin_half
        const z = axis[2] * sin_half
        const w = cos_half

        return new Quaternion(x, y, z, w)
    }

    get #norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }

    static #IsZero(x) {
        return this.norm < 0.00001
    }

    static #ConvertToDegrees(rad) {
        return rad * 180 / Math.PI
    }

    static #ConvertToRad(deg) {
        return deg * Math.PI / 180
    }
}

module.exports = Quaternion
