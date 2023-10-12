import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

if (!matchers) {
    console.error(
        "Error: Unable to load matchers from @testing-library/jest-dom."
    );
} else {
    expect.extend(matchers);
}

afterEach(() => {
    cleanup();
});
