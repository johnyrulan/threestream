import * as bootstrap from 'bootstrap'

export function initializeDropDown (): void {
  const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
  dropdownElementList.map(function (dropdownToggleEl) {
    return new bootstrap.Dropdown(dropdownToggleEl)
  })
}

export function initializePopover (): void {
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
  })
}

export function initializeTooltip (): void {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

export function toggleModal(id: string, toggle: 'show' | 'hide') {
  const modalEl = document.getElementById(id);

  if (!modalEl) return;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  if (toggle === 'show')
    modal.show()
  else
    modal.hide()
}

export function toggleOffCanvas(id: string, toggle: 'show' | 'hide') {
  const modalEl = document.getElementById(id);

  if (!modalEl) return;

  const modal = bootstrap.Offcanvas.getOrCreateInstance(modalEl);

  if (toggle === 'show')
    modal.show()
  else
    modal.hide()
}

export function collapse(id: string, toggle: 'show' | 'hide') {
  const el = document.getElementById(id);

  if (!el) return;

  const collapse = bootstrap.Collapse.getOrCreateInstance(el);

  if (toggle === 'show')
    collapse.show()
  else
    collapse.hide()
}

export function showTab(id: string) {
  const el = document.getElementById(id);

  if (!el) return;

  const tab = bootstrap.Tab.getOrCreateInstance(el);

  tab.show()
}

export function toggleCollapse(id: string) {
  const el = document.getElementById(id);

  if (!el) return;

  const collapse = bootstrap.Collapse.getOrCreateInstance(el);

  collapse.toggle()
}