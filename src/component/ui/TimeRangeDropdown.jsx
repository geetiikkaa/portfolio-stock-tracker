import { TIME_RANGES } from "../../constants/mockData";
import Dropdown from "./Dropdown";

export default function TimeRangeDropdown({ selectedRange, setSelectedRange }) {
  return (
    <Dropdown
      list={TIME_RANGES}
      selectedRange={selectedRange}
      setSelectedRange={setSelectedRange}
    />
  );
}
