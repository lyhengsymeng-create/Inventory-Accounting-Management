// ---- Tab switching ----
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });

    // ---- Business hours (Store Profile tab) ----
    const HOURS = [
      { day: 'ថ្ងៃច័ន្ទ', on: true, from: '08:00 ព្រឹក', to: '05:00 ល្ងាច' },
      { day: 'ថ្ងៃអង្គារ', on: true, from: '08:00 ព្រឹក', to: '05:00 ល្ងាច' },
      { day: 'ថ្ងៃពុធ', on: true, from: '08:00 ព្រឹក', to: '05:00 ល្ងាច' },
      { day: 'ថ្ងៃព្រហស្បតិ៍', on: true, from: '08:00 ព្រឹក', to: '05:00 ល្ងាច' },
      { day: 'ថ្ងៃសុក្រ', on: true, from: '08:00ព្រឹក', to: '05:00 ល្ងាច' },
      { day: 'ថ្ងៃសៅរ៍', on: true, from: '08:00 ព្រឹក', to: '11:00 ព្រឹក' },
      // { day: 'ថ្ងៃអាទិត្យ', on: false, from: '08:00 ព្រឹក', to: '11:00 ព្រឹក' },
    ];
    const hoursList = document.getElementById('hoursList');
    hoursList.innerHTML = HOURS.map((h, i) => `
    <div class="bh-row">
      <div class="bh-top">
        <span class="day">${h.day}</span>
        <label class="switch"><input type="checkbox" ${h.on ? 'checked' : ''} data-day="${i}"><span class="slider"></span></label>
      </div>
      <div class="bh-times ${h.on ? '' : 'disabled'}" id="bh-times-${i}">
        <input type="text" value="${h.from}" ${h.on ? '' : 'disabled'}>
        <span class="sep">–</span>
        <input type="text" value="${h.to}" ${h.on ? '' : 'disabled'}>
      </div>
    </div>
  `).join('');
    hoursList.querySelectorAll('input[data-day]').forEach(cb => {
      cb.addEventListener('change', () => {
        const wrap = document.getElementById('bh-times-' + cb.dataset.day);
        wrap.classList.toggle('disabled', !cb.checked);
        wrap.querySelectorAll('input').forEach(inp => inp.disabled = !cb.checked);
      });
    });

    // ---- Add New Branch modal ----
    const branchOverlay = document.getElementById('branchModalOverlay');
    const addBranchBtn = document.getElementById('addBranchBtn');
    const branchCancelBtn = document.getElementById('branchCancelBtn');
    const branchModalClose = document.getElementById('branchModalClose');
    const branchSaveBtn = document.getElementById('branchSaveBtn');
    const branchNameInput = document.getElementById('branchName');
    const branchNameError = document.getElementById('branchNameError');
    const branchesTbody = document.getElementById('branchesTbody');

    const STATUS_META = {
      ok: { icon: 'bi-check-circle-fill', label: 'សកម្ម' },
      warn: { icon: 'bi-exclamation-triangle-fill', label: 'កំពុងរៀបចំ' },
      bad: { icon: 'bi-x-circle-fill', label: 'អសកម្ម' },
    };
    let nextStoreId = 8851;

    function openBranchModal() {
      branchOverlay.classList.add('show');
      branchNameInput.value = '';
      document.getElementById('branchStoreId').value = '';
      document.getElementById('branchManager').value = '';
      document.getElementById('branchStatus').value = 'warn';
      branchNameError.classList.remove('show');
      setTimeout(() => branchNameInput.focus(), 50);
    }
    function closeBranchModal() { branchOverlay.classList.remove('show'); }

    addBranchBtn.addEventListener('click', openBranchModal);
    branchCancelBtn.addEventListener('click', closeBranchModal);
    branchModalClose.addEventListener('click', closeBranchModal);
    branchOverlay.addEventListener('click', (e) => { if (e.target === branchOverlay) closeBranchModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && branchOverlay.classList.contains('show')) closeBranchModal(); });

    function wireManageButtons() {
      branchesTbody.querySelectorAll('button.btn-ghost').forEach(btn => {
        if (btn.dataset.wired) return;
        btn.dataset.wired = '1';
        btn.addEventListener('click', () => {
          const row = btn.closest('tr');
          const name = row.querySelector('td.t').textContent;
          showToast(`គ្រប់គ្រង "${name}" — មកដល់ឆាប់ៗនេះ`);
        });
      });
    }
    wireManageButtons();

    branchSaveBtn.addEventListener('click', () => {
      const name = branchNameInput.value.trim();
      if (!name) {
        branchNameError.classList.add('show');
        branchNameInput.focus();
        return;
      }
      branchNameError.classList.remove('show');

      let storeId = document.getElementById('branchStoreId').value.trim();
      if (!storeId) { storeId = '#' + (nextStoreId++); }
      else if (!storeId.startsWith('#')) { storeId = '#' + storeId; }

      const manager = document.getElementById('branchManager').value.trim() || 'មិនទាន់កំណត់';
      const statusKey = document.getElementById('branchStatus').value;
      const meta = STATUS_META[statusKey];

      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td class="t">${name.replace(/</g, '&lt;')}</td>
      <td>${storeId.replace(/</g, '&lt;')}</td>
      <td>${manager.replace(/</g, '&lt;')}</td>
      <td><span class="pill ${statusKey}"><i class="bi ${meta.icon}"></i> ${meta.label}</span></td>
      <td><button class="btn-ghost">គ្រប់គ្រង</button></td>
    `;
      branchesTbody.appendChild(tr);
      wireManageButtons();

      closeBranchModal();
      showToast(`សាខា "${name}" ត្រូវបានបន្ថែម`);
    });

    function showToast(msg) {
      const t = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      t.classList.add('show');
      clearTimeout(window._toastT);
      window._toastT = setTimeout(() => { t.classList.remove('show'); document.getElementById('toastMsg').textContent = 'បានរក្សាទុកការផ្លាស់ប្តូរ'; }, 2600);
    }

    // ---- Add Custom Role modal ----
    const roleOverlay = document.getElementById('roleModalOverlay');
    const addRoleBtn = document.getElementById('addRoleBtn');
    const roleCancelBtn = document.getElementById('roleCancelBtn');
    const roleModalClose = document.getElementById('roleModalClose');
    const roleSaveBtn = document.getElementById('roleSaveBtn');
    const roleNameInput = document.getElementById('roleName');
    const roleNameError = document.getElementById('roleNameError');
    const rolesTbody = document.getElementById('rolesTbody');

    const PILL_LABEL = { ok: 'ពេញលេញ', warn: 'មើលបានតែប៉ុណ្ណោះ', bad: 'គ្មាន' };

    // ---- Roles persistence (localStorage) ----
    const ROLES_STORAGE_KEY = 'iam_settings_roles';

    const DEFAULT_ROLES = [
      { name: 'អ្នកគ្រប់គ្រង', users: 3, perms: ['ok', 'ok', 'ok', 'ok'] },
      { name: 'អ្នកគិតលុយ', users: 8, perms: ['ok', 'warn', 'bad', 'bad'] },
      { name: 'បុគ្គលិកស្តុក', users: 4, perms: ['bad', 'ok', 'warn', 'bad'] },
    ];

    function loadRoles() {
      try {
        const saved = JSON.parse(localStorage.getItem(ROLES_STORAGE_KEY));
        if (Array.isArray(saved) && saved.length) return saved;
      } catch (e) { /* fall through to defaults */ }
      return DEFAULT_ROLES;
    }

    function saveRoles(roles) {
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
    }

    function renderRoles(roles) {
      rolesTbody.innerHTML = roles.map(r => `
      <tr>
        <td class="t">${r.name.replace(/</g, '&lt;')}</td>
        <td>${r.users}</td>
        ${r.perms.map(p => `<td><span class="pill ${p}">${PILL_LABEL[p]}</span></td>`).join('')}
      </tr>
    `).join('');
    }

    let roles = loadRoles();
    renderRoles(roles);

    function openRoleModal() {
      roleOverlay.classList.add('show');
      roleNameInput.value = '';
      document.getElementById('roleUsers').value = 0;
      ['rolePermSales', 'rolePermInventory', 'rolePermReports', 'rolePermSettings'].forEach(id => {
        document.getElementById(id).value = 'bad';
      });
      roleNameError.classList.remove('show');
      setTimeout(() => roleNameInput.focus(), 50);
    }
    function closeRoleModal() { roleOverlay.classList.remove('show'); }

    addRoleBtn.addEventListener('click', openRoleModal);
    roleCancelBtn.addEventListener('click', closeRoleModal);
    roleModalClose.addEventListener('click', closeRoleModal);
    roleOverlay.addEventListener('click', (e) => { if (e.target === roleOverlay) closeRoleModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && roleOverlay.classList.contains('show')) closeRoleModal(); });

    roleSaveBtn.addEventListener('click', () => {
      const name = roleNameInput.value.trim();
      if (!name) {
        roleNameError.classList.add('show');
        roleNameInput.focus();
        return;
      }
      roleNameError.classList.remove('show');

      const users = document.getElementById('roleUsers').value || 0;
      const perms = ['rolePermSales', 'rolePermInventory', 'rolePermReports', 'rolePermSettings']
        .map(id => document.getElementById(id).value);

      roles.push({ name, users, perms });
      saveRoles(roles);
      renderRoles(roles);

      closeRoleModal();
      const t = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = `តួនាទី "${name}" ត្រូវបានបន្ថែម`;
      t.classList.add('show');
      clearTimeout(window._toastT);
      window._toastT = setTimeout(() => { t.classList.remove('show'); document.getElementById('toastMsg').textContent = 'បានរក្សាទុកការផ្លាស់ប្តូរ'; }, 2600);
    });

    // ---- Save button toast ----
    document.getElementById('saveBtn').addEventListener('click', () => {
      const t = document.getElementById('toast');
      t.classList.add('show');
      clearTimeout(window._toastT);
      window._toastT = setTimeout(() => t.classList.remove('show'), 2400);
    });