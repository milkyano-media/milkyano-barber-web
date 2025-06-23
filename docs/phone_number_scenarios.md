# Phone Number Input Scenarios

This document describes the expected behavior of the phone number input field across all forms in the application.

## Initial State

- **On component mount**: Field displays "+61" (Australian country code)
- **Placeholder**: Shows "+61 4XX XXX XXX" when field is empty
- **Country selector**: Shows Australian flag by default but allows selection of other countries

## Deletion Scenarios

### 1. Backspace from End of "+61"
- **Initial**: `+61|` (cursor at end)
- **Action**: Press Backspace
- **Result**: `+6|`
- **Note**: Custom handler prevents complete clearing

### 2. Continue Backspacing
- **Initial**: `+6|`
- **Action**: Press Backspace
- **Result**: `+|`

### 3. Final Backspace
- **Initial**: `+|`
- **Action**: Press Backspace
- **Result**: `|` (empty field)

### 4. Backspace from Middle of Number
- **Initial**: `+61 412| 345 678`
- **Action**: Press Backspace
- **Result**: `+61 41| 345 678`
- **Note**: Normal character deletion

### 5. Select All and Delete
- **Initial**: `+61 412 345 678` (all selected)
- **Action**: Press Delete or Backspace
- **Result**: `|` (empty field)

## Typing Scenarios

### 1. Type After Initial "+61"
- **Initial**: `+61|`
- **Action**: Type "4"
- **Result**: `+61 4|`
- **Note**: Space automatically added for formatting

### 2. Type After Partial Deletion
- **Initial**: `+6|` (after deleting "1" from "+61")
- **Action**: Type "1"
- **Result**: `+61|`

### 3. Type in Empty Field
- **Initial**: `|` (empty)
- **Action**: Type "0"
- **Result**: `0|`
- **Note**: For Australian numbers, typing "04" triggers formatting

### 4. Type International Format
- **Initial**: `|` (empty)
- **Action**: Type "+44"
- **Result**: `+44|`
- **Note**: Country flag updates to UK

## Copy/Paste Scenarios

### 1. Paste Australian International Format
- **Initial**: `|` (empty)
- **Action**: Paste "+61 412 345 678"
- **Result**: `+61 412 345 678`
- **Note**: Properly formatted and recognized

### 2. Paste Australian Domestic Format
- **Initial**: `|` (empty)
- **Action**: Paste "0412 345 678"
- **Result**: `0412 345 678`
- **Note**: Formatted as Australian number

### 3. Paste Without Country Code
- **Initial**: `|` (empty)
- **Action**: Paste "412 345 678"
- **Result**: `412 345 678`
- **Note**: May not be recognized as valid until country code added

### 4. Paste International Number
- **Initial**: `|` (empty)
- **Action**: Paste "+1 555 123 4567"
- **Result**: `+1 555 123 4567`
- **Note**: Country selector updates to USA

## Country Selection Scenarios

### 1. Change Country via Dropdown
- **Initial**: `+61|` (Australia selected)
- **Action**: Select USA from dropdown
- **Result**: `+1|`
- **Note**: Country code updates automatically

### 2. Change Country with Existing Number
- **Initial**: `+61 412 345 678`
- **Action**: Select UK from dropdown
- **Result**: `+44|`
- **Note**: Existing number cleared, only new country code shown

## Edge Cases

### 1. Invalid Characters
- **Initial**: `+61|`
- **Action**: Type "abc"
- **Result**: `+61|`
- **Note**: Non-numeric characters ignored (except + at start)

### 2. Multiple Plus Signs
- **Initial**: `+61|`
- **Action**: Type "+"
- **Result**: `+61|`
- **Note**: Additional + signs ignored

### 3. Very Long Numbers
- **Initial**: `+61 412 345 678|`
- **Action**: Continue typing digits
- **Result**: Input stops accepting after valid phone number length

### 4. Cursor Position Preservation
- **Initial**: `+61 4|12 345 678`
- **Action**: Type "0"
- **Result**: `+61 40|12 345 678`
- **Note**: Cursor position maintained relative to content

## Form Validation Scenarios

### 1. Empty Field Submission
- **State**: `|` (empty)
- **Action**: Submit form
- **Result**: Validation error: "Please enter a valid phone number"

### 2. Incomplete Number
- **State**: `+61 4`
- **Action**: Submit form
- **Result**: Validation error: "Please enter a valid phone number"

### 3. Valid Number
- **State**: `+61 412 345 678`
- **Action**: Submit form
- **Result**: Validation passes

### 4. International Number
- **State**: `+44 20 7123 4567`
- **Action**: Submit form
- **Result**: Validation passes if valid for selected country

## Component-Specific Behaviors

### Login/Register Forms
- Start with "+61" pre-filled on mount
- Allow complete deletion to empty
- Full international support

### Booking Form
- Start with "+61" pre-filled
- Auto-fill from authenticated user data
- Phone validation triggers customer lookup

### Modal Forms
- Reset to "+61" each time modal opens
- Clear on successful submission
- Maintain value on close without submission

## Technical Implementation Notes

1. **Library**: react-phone-number-input v3.4.12
2. **Format Mode**: `international={false}` for natural editing
3. **Default Country**: Australia (AU)
4. **Custom Handlers**: 
   - Backspace handling for "+61" → "+6" transition
   - Input type restrictions (numeric + allowed)
5. **Validation**: Uses `isValidPhoneNumber` from library
6. **Storage Format**: E164 format (e.g., "+61412345678")

## Testing Checklist

- [ ] Initial "+61" display on all forms
- [ ] Backspace behavior (+61 → +6 → + → empty)
- [ ] Country selection updates
- [ ] Copy/paste of various formats
- [ ] Form validation with invalid numbers
- [ ] Auto-formatting during typing
- [ ] International number support
- [ ] Cursor position after formatting
- [ ] Mobile keyboard (numeric) display
- [ ] Accessibility with screen readers