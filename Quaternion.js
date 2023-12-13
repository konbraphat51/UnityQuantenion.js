/**
 * Full Scratch UnityEngine.Quaternion implementation
 *
 * Writer: https://github.com/konbraphat51
 * LICENSE: BSD 1-Clause License (Write my name when using code, no need when compiled)
 */

/**
 * @constructor Make a new Quaternion instance
 * @classdesc Quaternion class, immitating UnityEngine.Quaternion.
 * this = `x`i + `y`j + `z`k + `w`(real)
 * The coordinate system is based on Unity's left-handed coordinate + left-hand thread rotation system.
 * @see Coordinate_System: https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.dsky.co%2Ftag%2Fxyzypr%2F&psig=AOvVaw0OgXth3KMz8bCrb6yFlMde&ust=1702207835957000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLDrv8WggoMDFQAAAAAdAAAAABAR
 * @param {number} x 0th element of the quaternion. Don't set this value.
 * @param {number} y 1st element of the quaternion. Don't set this value.
 * @param {number} z 2nd element of the quaternion. Don't set this value.
 * @param {number} w 3rd element of the quaternion. Don't set this value.
 * @see https://docs.unity3d.com/ja/2023.2/ScriptReference/Quaternion.html
 */
class Quaternion {
	//Calculations based on:
	//https://www.mesw.co.jp/business/report/pdf/mss_18_07.pdf

	//description above
	constructor(x, y, z, w) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
	}

	/**
	 * @description Returns or sets the euler angle representation of the rotation in degrees.
	 *  The order is Z-rotaion -> X-rotation -> Y-rotation.
	 * @see https://docs.unity3d.com/2023.2/Documentation/ScriptReference/Quaternion-eulerAngles.html
	 * @returns {number[]} [x, y, z] in degrees
	 */
	get eulerAngles() {
		//based on https://qiita.com/edo_m18/items/5db35b60112e281f840e#unity%E3%81%A7%E5%AE%9F%E8%A1%8C%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B

		const normalized = this.normalized
		const _x = normalized.x
		const _y = normalized.y
		const _z = normalized.z
		const _w = normalized.w

		let sinx = 2 * _y * _z - 2 * _x * _w
		let x, y, z

		if (Math.abs(sinx - 1) < 0.01) {
			//sinx == 1 (singularity)
			x = Math.PI / 2
			y = 0
			z = Math.atan2(2 * _x * _y - 2 * _z * _w, 1 - 2 * _y * _y - 2 * _z * _z)
		} else if (Math.abs(sinx + 1) < 0.01) {
			//sinx == -1 (singularity)
			x = -Math.PI / 2
			y = 0
			z = Math.atan2(2 * _x * _y - 2 * _z * _w, 1 - 2 * _y * _y - 2 * _z * _z)
		} else {
			x = Math.asin(-sinx)
			y = Math.atan2(2 * _x * _z + 2 * _y * _w, 1 - 2 * _x * _x - 2 * _y * _y)
			z = Math.atan2(2 * _x * _y + 2 * _z * _w, 1 - 2 * _x * _x - 2 * _z * _z)
		}

		//to degrees
		x = Quaternion.#ConvertToDegrees(x)
		y = Quaternion.#ConvertToDegrees(y)
		z = Quaternion.#ConvertToDegrees(z)

		//to [0, 360]
		if (x < 0) x += 360
		if (y < 0) y += 360
		if (z < 0) z += 360

		return [x, y, z]
	}

	/**
	 * @description Returns the norm=1 quaternion that represents the same rotation.
	 * @returns {Quaternion} Normalized quaternion
	 */
	get normalized() {
		const norm = this.#norm
		return new Quaternion(
			this.x / norm,
			this.y / norm,
			this.z / norm,
			this.w / norm,
		)
	}

	static get identity() {
		return new Quaternion(0, 0, 0, 1)
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
		const computed = Quaternion.FromToRotation(fromDirection, toDirection)
		this.x = computed.x
		this.y = computed.y
		this.z = computed.z
		this.w = computed.w
	}

	SetLookRotation(view, up) {
		const computed = Quaternion.LookRotation(view, up)
		this.x = computed.x
		this.y = computed.y
		this.z = computed.z
		this.w = computed.w
	}

	/**
	 * @description Converts a rotation to angle-axis representation (angles in degrees).
	 * @returns { [number, number[]] } [Angle, Axis] in degrees
	 */
	ToAngleAxis() {
		//based on https://qiita.com/aa_debdeb/items/3d02e28fb9ebfa357eaf#%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E8%A7%92%E3%81%8B%E3%82%89%E3%82%AF%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%8B%E3%82%AA%E3%83%B3

		const normalized = this.normalized

		let angle = 2 * Math.acos(normalized.w)

		const sin_half = Math.sin(angle / 2)
		const axis = [
			normalized.x / sin_half,
			normalized.y / sin_half,
			normalized.z / sin_half,
		]

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
		return `(${this.x.toFixed(digits)}, ${this.y.toFixed(
			digits,
		)}, ${this.z.toFixed(digits)}, ${this.w.toFixed(digits)})`
	}

	/**
	 * @description Returns product of two quaternions.
	 * Meaning that the rotation of q0 is applied first, then q1.
	 * @param {Quaternion} quaternions Quaternion to be applied in order
	 * @returns
	 */
	static Multiply(...quaternions) {
		if (quaternions.length == 0) return Quaternion.identity
		if (quaternions.length == 1) return quaternions[0]

		let result = quaternions[0]

		for (let cnt = 1; cnt < quaternions.length; cnt++) {
			//based on https://www.mesw.co.jp/business/report/pdf/mss_18_07.pdf
			let q0 = result
			let q1 = quaternions[cnt]

			let x = q0.x * q1.w + q0.w * q1.x - q0.z * q1.y + q0.y * q1.z
			let y = q0.y * q1.w + q0.z * q1.x + q0.w * q1.y - q0.x * q1.z
			let z = q0.z * q1.w - q0.y * q1.x + q0.x * q1.y + q0.w * q1.z
			let w = q0.w * q1.w - q0.x * q1.x - q0.y * q1.y - q0.z * q1.z

			result = new Quaternion(x, y, z, w)
		}

		return result
	}

	/**
	 * @description Rotate a vector
	 * @param {number[]} vector vector to rotate
	 * @returns {number[]} rotated vector
	 */
	RotateVector(vector) {
		const normalized = this.normalized
		const inverted = normalized.#conjugate
		const qVector = new Quaternion(vector[0], vector[1], vector[2], 0)

		const rotated = Quaternion.Multiply(
			normalized,
			Quaternion.Multiply(qVector, inverted),
		)

		return [rotated.x, rotated.y, rotated.z]
	}

	/**
	 * @description Returns the angle in degrees between two rotations a and b.
	 * @param {Quaternion} a quanternion
	 * @param {Quaternion} b quanternion
	 * @see https://docs.unity3d.com/ScriptReference/Quaternion.Angle.html
	 */
	static Angle(a, b) {
		const dot = Quaternion.Dot(a.normalized, b.normalized)
		const rad = Math.acos(dot) * 2
		const degrees = Quaternion.#ConvertToDegrees(rad)

		return degrees
	}

	/**
	 * @description Creates a rotation which rotates angle degrees around axis.
	 * @param {number} angle rotation in degrees rotated in axis
	 * @param {number[]} axis axis vector
	 * @returns {Quaternion} Quaternion made
	 */
	static AngleAxis(angle, axis) {
		//based on https://qiita.com/aa_debdeb/items/3d02e28fb9ebfa357eaf#%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E8%A7%92%E3%81%8B%E3%82%89%E3%82%AF%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%8B%E3%82%AA%E3%83%B3
		const rad = Quaternion.#ConvertToRad(angle)
		const sin_half = Math.sin(rad / 2)
		const cos_half = Math.cos(rad / 2)

		//normalize axis
		const norm = Math.sqrt(
			axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2],
		)
		axis = [axis[0] / norm, axis[1] / norm, axis[2] / norm]

		const x = axis[0] * sin_half
		const y = axis[1] * sin_half
		const z = axis[2] * sin_half
		const w = cos_half

		return new Quaternion(x, y, z, w)
	}

	/**
	 * @description Returns the dot product between two rotations a and b.
	 * @param {Quaternion} a  quaternion
	 * @param {Quaternion} b quaternion
	 * @returns {number} dot product
	 */
	static Dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
	}

	/**
	 * @description Returns a rotation that rotates z degrees around the z axis, x degrees around the x axis, and y degrees around the y axis; applied in that order.
	 * @param {number} x rotation in degrees around x axis
	 * @param {number} y rotation in degrees around y axis
	 * @param {number} z rotaion in degrees around z axis
	 * @return {Quaternion} Quaternion made
	 */
	static Euler(x, y, z) {
		//based on https://ohtorii.hatenadiary.jp/entry/20150424/p1

		const sx = Math.sin(Quaternion.#ConvertToRad(x) / 2)
		const cx = Math.cos(Quaternion.#ConvertToRad(x) / 2)
		const sy = Math.sin(Quaternion.#ConvertToRad(y) / 2)
		const cy = Math.cos(Quaternion.#ConvertToRad(y) / 2)
		const sz = Math.sin(Quaternion.#ConvertToRad(z) / 2)
		const cz = Math.cos(Quaternion.#ConvertToRad(z) / 2)

		const _x = cx * sy * sz + cy * cz * sx
		const _y = cx * cz * sy - cy * sx * sz
		const _z = cx * cy * sz - cz * sx * sy
		const _w = sx * sy * sz + cx * cy * cz

		return new Quaternion(_x, _y, _z, _w)
	}

	/**
	 * @description Creates a rotation which rotates from fromDirection to toDirection.
	 * @param {number[]} fromDirection direction vector that rotation starts from
	 * @param {number[]} toDirection direction vector that rotation ends at
	 * @returns {Quaternion} Quaternion made
	 */
	static FromToRotation(fromDirection, toDirection) {
		//normalize
		const fromDirectionNorm = Math.sqrt(
			fromDirection[0] * fromDirection[0] +
				fromDirection[1] * fromDirection[1] +
				fromDirection[2] * fromDirection[2],
		)
		fromDirection = [
			fromDirection[0] / fromDirectionNorm,
			fromDirection[1] / fromDirectionNorm,
			fromDirection[2] / fromDirectionNorm,
		]
		const toDirectionNorm = Math.sqrt(
			toDirection[0] * toDirection[0] +
				toDirection[1] * toDirection[1] +
				toDirection[2] * toDirection[2],
		)
		toDirection = [
			toDirection[0] / toDirectionNorm,
			toDirection[1] / toDirectionNorm,
			toDirection[2] / toDirectionNorm,
		]

		// rotation axis
		const rotationAxis = Quaternion.#CrossVec(fromDirection, toDirection)

		//get angle
		const dot =
			fromDirection[0] * toDirection[0] +
			fromDirection[1] * toDirection[1] +
			fromDirection[2] * toDirection[2]
		const angle = Quaternion.#ConvertToDegrees(Math.acos(dot))

		return Quaternion.AngleAxis(angle, rotationAxis)
	}

	/**
	 * @description Returns the Inverse of rotation.
	 * @param {Quaternion} rotation rotation to be inverted
	 * @returns {Quaternion} Inverse of rotation
	 */
	static Inverse(rotation) {
		const c = rotation.#conjugate
		const division = rotation.#norm * rotation.#norm

		return new Quaternion(
			c.x / division,
			c.y / division,
			c.z / division,
			c.w / division,
		)
	}

	/**
	 * @description Interpolates between a and b by t and normalizes the result afterwards. The parameter t is clamped to the range [0, 1].
	 * @param {Quaternion} a quaternion starts from
	 * @param {Quaternion} b quaternion ends at
	 * @param {number} t interpolation factor. This will limited between 0 and 1.
	 * @returns {Quaternion} Interpolated quaternion
	 */
	static Lerp(a, b, t) {
		if (t < 0) t = 0
		if (t > 1) t = 1

		return Quaternion.LerpUnclamped(a, b, t)
	}

	/**
	 * @description Interpolates between a and b by t and normalizes the result afterwards. The parameter t is not clamped.
	 * @param {Quaternion} a quaternion starts from
	 * @param {Quaternion} b quaternion ends at
	 * @param {number} t interpolation factor
	 * @returns {Quaternion} Interpolated quaternion
	 */
	static LerpUnclamped(a, b, t) {
		a = a.normalized
		b = b.normalized

		let x = a.x * (1 - t) + b.x * t
		let y = a.y * (1 - t) + b.y * t
		let z = a.z * (1 - t) + b.z * t
		let w = a.w * (1 - t) + b.w * t

		return new Quaternion(x, y, z, w).normalized
	}

	/**
	 * @description Creates a rotation with the specified forward and upwards directions.
	 * Z: forward, Y: upwards
	 * @see https://docs.unity3d.com/2019.4/Documentation/ScriptReference/Quaternion.LookRotation.html
	 * @param {number[]} forward direction vector looking at
	 * @param {number[]} upwards direction vector upwards from `forward`. Default is [0, 1, 0]
	 * @returns {Quaternion} Quaternion made
	 */
	static LookRotation(forward, upwards = [0, 1, 0]) {
		let zVec = forward
		let xVec = Quaternion.#CrossVec(upwards, zVec)
		let yVec = Quaternion.#CrossVec(zVec, xVec)

		//normalize
		const norm_x = Math.sqrt(
			xVec[0] * xVec[0] + xVec[1] * xVec[1] + xVec[2] * xVec[2],
		)
		xVec = [xVec[0] / norm_x, xVec[1] / norm_x, xVec[2] / norm_x]
		const norm_y = Math.sqrt(
			yVec[0] * yVec[0] + yVec[1] * yVec[1] + yVec[2] * yVec[2],
		)
		yVec = [yVec[0] / norm_y, yVec[1] / norm_y, yVec[2] / norm_y]
		const norm_z = Math.sqrt(
			zVec[0] * zVec[0] + zVec[1] * zVec[1] + zVec[2] * zVec[2],
		)
		zVec = [zVec[0] / norm_z, zVec[1] / norm_z, zVec[2] / norm_z]

		//first rotation: [1, 0, 0] -> xVec
		const firstRotation = Quaternion.FromToRotation([1, 0, 0], xVec)

		//second rotaion: rotated [0, 1, 0] -> yVec
		const yAxisRotatedFirst = firstRotation.RotateVector([0, 1, 0])
		const secondRotation = Quaternion.FromToRotation(yAxisRotatedFirst, yVec)

		return Quaternion.Multiply(secondRotation, firstRotation)
	}

	/**
	 * @description Returns a normalized quaternion
	 * @param {Quaternion} q Quaternion to be normalized
	 * @returns Normalized quaternion
	 */
	static Normalize(q) {
		return q.normalized
	}

	/**
	 * @description Get a rotation between 2 quaternions
	 * @param {Quaternion} from Quaternion starts from
	 * @param {Quaternion} to Quaternion ends at
	 * @param {number} maxDegreesDelta Maximum number of degrees to rotate allowed
	 * @returns {Quaternion} Rotation between 2 quaternions
	 */
	static RotateTowards(from, to, maxDegreesDelta = 10000) {
		//normalize
		from = from.normalized
		to = to.normalized

		// get destination to go to
		let angle = Quaternion.Angle(from, to)

		let ratio
		if (angle > maxDegreesDelta) ratio = maxDegreesDelta / angle
		else ratio = 1

		let target = Quaternion.Lerp(from, to, ratio)

		//from -> target
		return target
	}

	/**
	 * @description Spherically linear interpolates between unit quaternions a and b by a ratio of t.
	 * @see https://docs.unity3d.com/ja/2023.2/ScriptReference/Quaternion.Slerp.html
	 * @param {Quaternion} a Start unit quaternion value, returned when t = 0.
	 * @param {Quaternion} b End unit quaternion value, returned when t = 1.
	 * @param {number} t Interpolation ratio. Value is clamped to the range [0, 1].
	 * @returns {Quaternion} Interpolated quaternion
	 */
	static Slerp(a, b, t) {
		//clamp
		if (t < 0) t = 0
		if (t > 1) t = 1

		return Quaternion.SlerpUnclamped(a, b, t)
	}

	/**
	 * @description Spherically linear interpolates between a and b by t. The parameter t is not clamped.
	 * @param {Quatenion} a Start unit quaternion value.
	 * @param {Quaternion} b End unit quaternion value.
	 * @param {number} t Interpolation ratio.
	 * @returns {Quaternion} Interpolated quaternion
	 */
	static SlerpUnclamped(a, b, t) {
		a = a.normalized
		b = b.normalized

		t = -Math.cos(t * Math.PI) / 2 + 0.5

		return Quaternion.LerpUnclamped(a, b, t)
	}

	get #norm() {
		return Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
		)
	}

	get #conjugate() {
		return new Quaternion(-this.x, -this.y, -this.z, this.w)
	}

	static #ConvertToDegrees(rad) {
		return (rad * 180) / Math.PI
	}

	static #ConvertToRad(deg) {
		return (deg * Math.PI) / 180
	}

	static #CrossVec(a, b) {
		let x = a[1] * b[2] - a[2] * b[1]
		let y = a[2] * b[0] - a[0] * b[2]
		let z = a[0] * b[1] - a[1] * b[0]

		return [x, y, z]
	}
}

if (typeof module !== "undefined") module.exports = Quaternion
