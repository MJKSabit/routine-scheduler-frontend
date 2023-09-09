export const times = [8, 9, 10, 11, 12, 1, 2, 3, 4];
export const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
const break_times = new Set([1]);

export default function ScheduleSelectionTable({
  filled,
  selected,
  onChange,
  labTimes,
  dualCheck,
}) {
  filled = filled || new Set();
  selected = selected || new Set();
  labTimes = labTimes || new Set(days.map((day) => `${day} 2`));
  onChange =
    onChange || ((day, time, checked) => console.log(day, time, checked));
  dualCheck = dualCheck || new Set();

  const changedOnChange = (day, time, checked) => {
    if (!(selected.has(`${day} ${time}`) && filled.has(`${day} ${time}`))) {
      onChange(day, time, checked);
    }
  };

  return (
    <table class="table routine-table">
      <thead>
        <tr>
          <th scope="col" className="col-2">
            Day \ Time
          </th>
          {times.map((time) => (
            <th scope="col">{time}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days.map((day) => (
          <tr>
            <th scope="row" className="col-2">
              {day}
            </th>
            {times
              .filter(
                (time) =>
                  !labTimes.has(`${day} ${time - 1}`) &&
                  !labTimes.has(`${day} ${time - 2}`)
              )
              .map((time) => (
                <td colSpan={labTimes.has(`${day} ${time}`) ? 3 : 1}>
                  <input
                    class="big-checkbox"
                    type="checkbox"
                    checked={
                      filled.has(`${day} ${time}`) ||
                      selected.has(`${day} ${time}`)
                    }
                    onChange={(e) =>
                      changedOnChange(day, time, e.target.checked)
                    }
                    disabled={
                      !selected.has(`${day} ${time}`) &&
                      (break_times.has(time) || filled.has(`${day} ${time}`))
                    }
                  />
                  {dualCheck.has(`${day} ${time}`) && (
                    <input
                      class="big-checkbox"
                      type="checkbox"
                      checked={
                        filled.has(`${day} ${time} DUP`) ||
                        selected.has(`${day} ${time} DUP`)
                      }
                      onChange={(e) =>
                        changedOnChange(day, time + " DUP", e.target.checked)
                      }
                      disabled={
                        !selected.has(`${day} ${time} DUP`) &&
                        (break_times.has(time) || filled.has(`${day} ${time}`))
                      }
                    />
                  )}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
