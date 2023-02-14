import React from "react";
import { render, screen, act, waitFor, withFetch } from "@testing-library/react";
import SeasonalAnime from "../components/SeasonalAnime";
import { isElementOfType } from "react-dom/test-utils";

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({'data': typeof(Array), 'node': typeof(Object), 'paging': typeof(Object)})
}))

describe("App", () => {
  let Obj = { 'id': Array, 'paging': Object, 'season': Object }
  it("loads seasonal anime", async () => {
    const json = await SeasonalAnime
    await (async () => render(<SeasonalAnime />));

    expect(json.length).not.toEqual(0)
  })
})