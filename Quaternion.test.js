const Quaternion = require('./Quaternion.js')

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
    expect(e[0]).toBe(0)
    expect(e[1]).toBe(0)
    expect(e[2]).toBe(0)
})

test("eulerAngles() x-axis", () => {
    const q = new Quaternion(1, 0, 0, 0)
    const e = q.eulerAngles
    expect(e[0]).toBe(0)
    expect(e[1]).toBe(180)
    expect(e[2]).toBe(180)
})

test("eulerAngles() y-axis", () => {
    const q = new Quaternion(0, 1, 0, 0)
    const e = q.eulerAngles
    expect(e[0]).toBe(0)
    expect(e[1]).toBe(180)
    expect(e[2]).toBe(0)
})

test("eulerAngles() z-axis", () => {
    const q = new Quaternion(0, 0, 1, 0)
    const e = q.eulerAngles
    expect(e[0]).toBe(0)
    expect(e[1]).toBe(0)
    expect(e[2]).toBe(180)
})

test("normalization", () => {
    const q = new Quaternion(3, 0, 4, 0)
    const n = q.normalized
    expect(n.x).toBeCloseTo(0.6, 1)
    expect(n.y).toBeCloseTo(0, 2)
    expect(n.z).toBeCloseTo(0.8, 1)
    expect(n.w).toBeCloseTo(0, 1)
})

test("Set", () => {
    const q = new Quaternion(1, 2, 3, 4)
    q.Set(5, 6, 7, 8)
    expect(q.x).toBe(5)
    expect(q.y).toBe(6)
    expect(q.z).toBe(7)
    expect(q.w).toBe(8)
})

test("FromToRotation", () => {
    const q = new Quaternion(1, 2, 3, 4)
    //cover setter too
    q.SetFromToRotation(new Vector3(1, 0, 0), new Vector3(0, 1, 0))
    expect(q.x).toBeCloseTo(0, 2)
    expect(q.y).toBeCloseTo(0, 2)
    expect(q.z).toBeCloseTo(Math.sqrt(2) / 2, 2)
    expect(q.w).toBeCloseTo(Math.sqrt(2) / 2, 2)
})

test("LookRotation", () => {
    const q = new Quaternion(1, 2, 3, 4)
    //cover setter too
    q.SetLookRotation(new Vector3(1, 1, 1), new Vector3(0, 1, 0))
    expect(q.x).toBeCloseTo(-0.27, 1)
    expect(q.y).toBeCloseTo(0.36, 1)
    expect(q.z).toBeCloseTo(0.11, 1)
    expect(q.w).toBeCloseTo(0.88, 1)
})

test("ToAngleAxis", () => {
    const q = new Quaternion(1, 1, 1, 1).normalized
    const [angle, axis] = q.ToAngleAxis()
    expect(angle).toBeCloseTo(120, 2)
    expect(axis[0]).toBeCloseTo(0.58, 1)
    expect(axis[1]).toBeCloseTo(0.58, 1)
    expect(axis[2]).toBeCloseTo(0.58, 1)
})

test("ToString", () => {
    const q = new Quaternion(1, 2, 3, 4)
    expect(q.ToString(1)).toBe("1,2,3,4")
})

test("Multiply", () => {
    const q1 = new Quaternion(1, 2, 3, 4)
    const q2 = new Quaternion(4, 3, 2, 1)
    const q = Quaternion.Multiply(q1.normalized, q2.normalized)
    expect(q.x).toBeCloseTo(0.4, 1)
    expect(q.y).toBeCloseTo(0.8, 1)
    expect(q.z).toBeCloseTo(0.2, 1)
    expect(q.w).toBeCloseTo(-0.4, 1)
})

test("RotateVector", () => {
    const q = (new Quaternion(1, 2, 3, 4)).normalized

    let v = [4, 5, 6]
    let norm = Math.sqrt(4 * 4 + 5 * 5 + 6 * 6)
    v = [v[0] / norm, v[1] / norm, v[2] / norm]

    v = q.RotateVector(v)

    //normalize
    norm = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
    v = [v[0] / norm, v[1] / norm, v[2] / norm]

    expect(v[0]).toBeCloseTo(0.18, 1)
    expect(v[1]).toBeCloseTo(0.71, 1)
    expect(v[2]).toBeCloseTo(0.68, 1)
})

test("Angle", () => {
    const q0 = (new Quaternion(1, 2, 3, 4)).normalized
    const q1 = (new Quaternion(4, 2, 1, 3)).normalized

    expect(Quaternion.Angle(q0, q1)).toBeCloseTo(79.88902, 2)
})

test("Dot", () => {
    const q0 = new Quaternion(1, 2, 3, 4)
    const q1 = new Quaternion(4, 2, 1, 3)

    const result = Quaternion.Dot(q0, q1)

    expect(result).toBeCloseTo(23)
})

test("Euler", () => {
    const q = Quaternion.Euler(30, 60, 90)

    expect(q.x).toBeCloseTo(0.50, 1)
    expect(q.y).toBeCloseTo(0.18, 1)
    expect(q.z).toBeCloseTo(0.50, 1)
    expect(q.w).toBeCloseTo(0.68, 1)
})

test("Inverse", () => {
    const q = new Quaternion(0.5, 0.5, 0.5, 0.5)
    const inv = Quaternion.Inverse(q)

    expect(inv.x).toBeCloseTo(-0.5, 1)
    expect(inv.y).toBeCloseTo(-0.5, 1)
    expect(inv.z).toBeCloseTo(-0.5, 1)
    expect(inv.w).toBeCloseTo(0.5, 1)
})

test("Identity", () => {
    const q = Quaternion.identity

    expect(q.x).toBe(0)
    expect(q.y).toBe(0)
    expect(q.z).toBe(0)
    expect(q.w).toBe(1)
})

test("Lerp", () => {
    const q0 = new Quaternion(1, 2, 3, 4)
    const q1 = new Quaternion(2, 2, 2, 2)

    const q = Quaternion.Lerp(q0, q1, 0.5)

    expect(q.x).toBeCloseTo(0.32, 1)
    expect(q.y).toBeCloseTo(0.43, 1)
    expect(q.z).toBeCloseTo(0.54, 1)
    expect(q.w).toBeCloseTo(0.65, 1)
})
