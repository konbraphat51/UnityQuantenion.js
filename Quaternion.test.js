const Quaternion = require('./Quaternion.js')

function Approximate(v0, v1, e = 0.0001) {
    return Math.abs(v0 - v1) < e
}

test("constructor", () => {
    const q = new Quaternion(1, 2, 3, 4)
    expect(q.x).toBe(1)
    expect(q.y).toBe(2)
    expect(q.z).toBe(3)
    expect(q.w).toBe(4)
})

test("eulerAngles() zero-test", () => {
    const q = new Quaternion(0, 0, 0, 1)
    const e = q.eulerAngles
    expect(e.x).toBe(0)
    expect(e.y).toBe(0)
    expect(e.z).toBe(0)
})

test("eulerAngles() x-axis", () => {
    const q = new Quaternion(1, 0, 0, 0)
    const e = q.eulerAngles
    expect(e.x).toBe(0)
    expect(e.y).toBe(180)
    expect(e.z).toBe(180)
})

test("eulerAngles() y-axis", () => {
    const q = new Quaternion(0, 1, 0, 0)
    const e = q.eulerAngles
    expect(e.x).toBe(0)
    expect(e.y).toBe(180)
    expect(e.z).toBe(0)
})

test("eulerAngles() z-axis", () => {
    const q = new Quaternion(0, 0, 1, 0)
    const e = q.eulerAngles
    expect(e.x).toBe(0)
    expect(e.y).toBe(0)
    expect(e.z).toBe(180)
})

test("normalization", () => {
    const q = new Quaternion(3, 0, 4, 0)
    const n = q.normalized
    expect(n.x).toBeCloseTo(0.6)
    expect(n.y).toBeCloseTo(0)
    expect(n.z).toBeCloseTo(0.8)
    expect(n.w).toBeCloseTo(0)
})

test("Set", () => {
    const q = new Quaternion(1, 2, 3, 4)
    q.set(5, 6, 7, 8)
    expect(q.x).toBe(5)
    expect(q.y).toBe(6)
    expect(q.z).toBe(7)
    expect(q.w).toBe(8)
})

test("FromToRotation", () => {
    const q = Quaternion(1, 2, 3, 4)
    //cover setter too
    q.SetFromToRotation(new Vector3(1, 0, 0), new Vector3(0, 1, 0))
    expect(q.x).toBeCloseTo(0)
    expect(q.y).toBeCloseTo(0)
    expect(q.z).toBeCloseTo(Math.sqrt(2) / 2)
    expect(q.w).toBeCloseTo(Math.sqrt(2) / 2)
})

test("LookRotation", () => {
    const q = Quaternion(1, 2, 3, 4)
    //cover setter too
    q.SetLookRotation(new Vector3(1, 1, 1), new Vector3(0, 1, 0))
    expect(Approximate(q.x, -0.27, 0.1)).toBe(true)
    expect(Approximate(q.y, 0.36, 0.1)).toBe(true)
    expect(Approximate(q.z, 0.11, 0.1)).toBe(true)
    expect(Approximate(q.w, 0.88, 0.1)).toBe(true)
})

test("ToAngleAxis", () => {
    const q = Quaternion(1, 1, 1, 1).normalized
    const [angle, axis] = q.ToAngleAxis()
    expect(Approximate(angle, 120)).toBe(true)
    expect(Approximate(axis[0], 0.58, 0.1)).toBe(true)
    expect(Approximate(axis[1], 0.58, 0.1)).toBe(true)
    expect(Approximate(axis[2], 0.58, 0.1)).toBe(true)
})

test("ToString", () => {
    const q = Quaternion(1, 2, 3, 4)
    expect(q.ToString(1)).toBe("1,2,3,4")
})

test("Multiply", () => {
    const q1 = Quaternion(1, 2, 3, 4)
    const q2 = Quaternion(4, 3, 2, 1)
    const q = Quaternion.Multiply(q1.normalized, q2.normalized)
    expect(q.x).toBeCloseTo(0.4)
    expect(q.y).toBeCloseTo(0.8)
    expect(q.z).toBeCloseTo(0.2)
    expect(q.w).toBeCloseTo(-0.4)
})

test("RotateVector", () => {
    const q = Quaternion(1, 2, 3, 4).normalized

    let v = [4, 5, 6]
    let norm = Math.sqrt(4 * 4 + 5 * 5 + 6 * 6)
    v = [v[0] / norm, v[1] / norm, v[2] / norm]

    v = q.RotateVector(v)

    //normalize
    norm = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
    v = [v[0] / norm, v[1] / norm, v[2] / norm]

    expect(Approximate(v[0], 0.18, 0.1)).toBe(true)
    expect(Approximate(v[1], 0.71, 0.1)).toBe(true)
    expect(Approximate(v[2], 0.68, 0.1)).toBe(true)
})

test("Angle", () => {
    const q0 = Quaternion(1, 2, 3, 4).normalized
    const q1 = Quaternion(4, 2, 1, 3).normalized

    expect(Approximate(Quaternion.Angle(q0, q1), 79.88902, 0.1)).toBe(true)
})

test("Dot", () => {
    const q0 = Quaternion(1, 2, 3, 4)
    const q1 = Quaternion(4, 2, 1, 3)

    const result = Quaternion.Dot(q0, q1)

    expect(Approximate(result, 23, 0.01)).toBe(true)
})

test("Euler", () => {
    const q = Quaternion.Euler(30, 60, 90)

    expect(Approximate(q.x, 0.5, 0.1)).toBe(true)
    expect(Approximate(q.y, 0.18, 0.1)).toBe(true)
    expect(Approximate(q.z, 0.5, 0.1)).toBe(true)
    expect(Approximate(q.w, 0.68, 0.1)).toBe(true)
})

test("Inverse", () => {
    const q = Quaternion(0.5, 0.5, 0.5, 0.5)
    const inv = Quaternion.Inverse(q)

    expect(Approximate(inv.x, -0.5, 0.1)).toBe(true)
    expect(Approximate(inv.y, -0.5, 0.1)).toBe(true)
    expect(Approximate(inv.z, -0.5, 0.1)).toBe(true)
    expect(Approximate(inv.w, 0.5, 0.1)).toBe(true)
})

test("Identity", () => {
    const q = Quaternion.Identity()

    expect(q.x).toBe(0)
    expect(q.y).toBe(0)
    expect(q.z).toBe(0)
    expect(q.w).toBe(1)
})

test("Lerp", () => {
    const q0 = Quaternion(1, 2, 3, 4)
    const q1 = Quaternion(2, 2, 2, 2)

    const q = Quaternion.Lerp(q0, q1, 0.5)

    expect(Approximate(q.x, 0.32350, 0.1)).toBe(true)
    expect(Approximate(q.y, 0.43133, 0.1)).toBe(true)
    expect(Approximate(q.z, 0.53916, 0.1)).toBe(true)
    expect(Approximate(q.w, 0.64700, 0.1)).toBe(true)
})
