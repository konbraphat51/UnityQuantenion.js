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
    expect(e.x).toBe(0)
    expect(e.y).toBe(0)
    expect(e.z).toBe(0)
})

test("eulerAngles() x-axis", () => {
    const q = new Quaternion(1, 0, 0, 0)
    const e = q.eulerAngles
    expect(e.x).toBe(180)
    expect(e.y).toBe(0)
    expect(e.z).toBe(0)
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
    q.SetFromToRotation(new Vector3(1, 0, 0), new Vector3(0, 1, 0))
    expect(q.x).toBeCloseTo(0)
    expect(q.y).toBeCloseTo(0)
    expect(q.z).toBeCloseTo(Math.sqrt(2) / 2)
    expect(q.w).toBeCloseTo(Math.sqrt(2) / 2)
})
