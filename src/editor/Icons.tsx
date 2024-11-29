// Toolbar.tsx
import "./Icons.css";

export const Icons = {
  DragMoveIcon: () => (
    <svg className="icon" viewBox="0 0 24 24">
      <path d="M18 11V8L22 12L18 16V13H13V18H16L12 22L8 18H11V13H6V16L2 12L6 8V11H11V6H8L12 2L16 6H13V11H18Z" />
    </svg>
  ),
  Pointer: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="icon"
    >
      <path d="M13.9093 12.3603L17.0007 20.8537L14.1816 21.8798L11.0902 13.3864L6.91797 16.5422L8.4087 1.63318L19.134 12.0959L13.9093 12.3603Z"></path>
    </svg>
  ),
};
