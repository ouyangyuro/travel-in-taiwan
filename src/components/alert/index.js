import { XMarkIcon } from '@heroicons/react/24/solid';

/** ---------------------------------------------------------------------------------------------------------------------
 * Components: Alert
 * @param  {string}     open        控制開關
 * @param  {string}     message     訊息
 * @param  {string}     severity    error, success
 * @param  {function}   onClose     控制關閉
 *
 * @return {html}
 */
function Alert({
  open = false,
  message = '',
  severity = 'success',
  onClose = () => {},
}) {
  // ---------------------------------------------------------------------------------------------

  return (
    <>
      <div
        className={`z-[200] fixed top-5 left-2 right-2 ipad:left-1/2 ipad:translate-x-[-50%] px-4 py-3 rounded flex justify-between items-center border ${
          severity === 'error' && 'border-red-400 text-red-700 bg-red-100'
        } ${
          severity === 'success' &&
          'border-green-400 text-green-700 bg-green-100'
        } transition duration-150 ease-out ${open ? 'opacity-1' : 'opacity-0 hidden'}`}
        role="alert"
      >
        <strong className="font-bold">{message}</strong>
        <button className="px-4 py-3" onClick={onClose}>
          <XMarkIcon
            className={`fill-current h-6 w-6 ${
              severity === 'error' && 'text-red-500'
            } ${severity === 'success' && 'text-green-500'}`}
          />
        </button>
      </div>
    </>
  );
}

export default Alert;