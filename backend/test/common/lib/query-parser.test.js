import { QueryParser } from "../../../src/common/lib";

describe("QueryParser Test", () => {
    test("is:open 파싱", () => {
        // given
        const queryString = "is:open";

        // when
        const queryMap = QueryParser.parse(queryString);

        // then
        expect(queryMap.get("is")).toEqual("open");
        expect(queryMap.size).toEqual(1);
    });

    test("is:open label:frontend label:backend 파싱", () => {
        // given
        const queryString = "is:open label:frontend label:backend";

        // when
        const queryMap = QueryParser.parse(queryString);

        // then
        expect(queryMap.get("is")).toEqual("open");
        expect(queryMap.get("label")).toEqual(["frontend", "backend"]);
        expect(queryMap.size).toEqual(2);
    });

    test("숫자 파싱했을 때 null 반환", () => {
        // given
        const queryString = 127381;

        // when
        const queryMap = QueryParser.parse(queryString);

        // then
        expect(queryMap).toEqual(null);
    });

    test("객체 파싱했을 때 null 반환", () => {
        // given
        const queryString = {};

        // when
        const queryMap = QueryParser.parse(queryString);

        // then
        expect(queryMap).toEqual(null);
    });

    test("delimeter가 들어가지 않은 문자열 파싱하는 경우 비어있는 맵 반환", () => {
        // given
        const queryString = "sdjfksl";

        // when
        const queryMap = QueryParser.parse(queryString);

        // then
        expect(queryMap.size).toEqual(0);
    });
});
