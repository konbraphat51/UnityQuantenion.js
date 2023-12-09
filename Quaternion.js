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
        pitch = this.#ConvertToDegrees(pitch)
        row = this.#ConvertToDegrees(row)
        yaw = this.#ConvertToDegrees(yaw)

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
     * @see https://qiita.com/aa_debdeb/items/3d02e28fb9ebfa357eaf#%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E8%A7%92%E3%81%8B%E3%82%89%E3%82%AF%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%8B%E3%82%AA%E3%83%B3
     * @returns { [number, number[]] } [Angle, Axis] in degrees
     */
    ToAngleAxis() {
        let angle = 2 * Math.acos(this.w)

        let sin_half = Math.sin(angle / 2)
        let axis = [this.x / sin_half, this.y / sin_half, this.z / sin_half]

        //to degrees
        angle = this.#ConvertToDegrees(angle)

        return [angle, axis]
    }

    /**
     * @description Returns product of two quaternions. 
     * Meaning that the rotation of q0 is applied first, then q1.
     * @param {Quaternion} q0 Quaternion to be applied first
     * @param {Quaternion} q1 Quaternion to be applied second
     * @see https://www.mesw.co.jp/business/report/pdf/mss_18_07.pdf
     * @returns 
     */
    static Multiply(q0, q1) {
        return new Quaternion(
            q0.x * q1.x - q0.y * q1.y - q0.z * q1.z - q0.w * q1.w,
            q0.y * q1.x + q0.x * q1.y - q0.w * q1.z + q0.z * q1.w,
            q0.z * q1.x + q0.w * q1.y + q0.x * q1.z - q0.y * q1.w,
            q0.w * q1.x - q0.z * q1.y + q0.y * q1.z + q0.x * q1.w
        )
    }

    get #norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }

    #IsZero(x) {
        return this.norm < 0.00001
    }

    #ConvertToDegrees(rad) {
        return rad * 180 / Math.PI
    }
}

module.exports = Quaternion
