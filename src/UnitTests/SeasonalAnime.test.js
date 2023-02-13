import React from "react";
import { render, screen, act } from "@testing-library/react";
import SeasonalAnime from "../components/SeasonalAnime";

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    value: "title"
  })
}))

describe("App", () => {
  let Obj = { id: Number}
  it("loads seasonal anime", async () => {
    await (async () => render(<SeasonalAnime />));
    expect(Obj).toHaveProperty('id', Number)
  })
})