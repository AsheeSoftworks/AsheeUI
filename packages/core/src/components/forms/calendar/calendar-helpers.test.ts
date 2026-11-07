import { describe, expect, it } from "vitest";
import {
  CALENDAR_YEAR_PAGE_SIZE,
  getYearPageStart,
  getYearPageYears,
} from "./calendar-helpers";

describe("calendar year pages", () => {
  it("holds twelve years on a page", () => {
    expect(CALENDAR_YEAR_PAGE_SIZE).toBe(12);
    expect(getYearPageYears(2004)).toEqual([
      2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
    ]);
  });

  it("places 2005 on the page that starts at 2004", () => {
    expect(getYearPageStart(2005)).toBe(2004);
  });

  it("starts the first page at year one rather than year zero", () => {
    expect(getYearPageStart(1)).toBe(1);
    expect(getYearPageYears(1)[0]).toBe(1);
  });
});
