export default function Home() {
  return (
    <>
      <table style={{ border: "1px solid black" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>product</th>
            <th style={{ border: "1px solid black" }}>next order date</th>
            <th style={{ border: "1px solid black" }}>
              current inventory level
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid black" }}>product 1</td>
            <td style={{ border: "1px solid black" }}>date 1</td>
            <td style={{ border: "1px solid black" }}>inventory 1</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
