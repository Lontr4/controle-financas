// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCTQuDPTAtoCUMxZx2tzOB2TDEr9sCQWCg",
    authDomain: "controle-financas-9c015.firebaseapp.com",
    projectId: "controle-financas-9c015",
    storageBucket: "controle-financas-9c015.firebasestorage.app",
    messagingSenderId: "317294408562",
    appId: "1:317294408562:web:b6d16b5774512c06dee3eb",
    measurementId: "G-V0L9V3ZHBW"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;
let isSyncingFromCloud = false;

// ==========================================
// AUTENTICAÇÃO GOOGLE & SINCRONIZAÇÃO EM TEMPO REAL
// ==========================================
function handleGoogleAuth() {
    if (currentUser) {
        if (confirm(`Conectado como ${currentUser.email}.\nDeseja sair da conta?`)) {
            auth.signOut();
        }
    } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => {
            console.error("Erro no login Google:", err);
            alert("Não foi possível conectar com o Google: " + err.message);
        });
    }
}

function updateAuthUI(user) {
    const avatar = document.getElementById('google-user-avatar');
    const label = document.getElementById('lbl-google-auth');
    if (!avatar || !label) return;

    if (user) {
        avatar.src = user.photoURL || 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg';
        label.innerText = user.displayName ? user.displayName.split(' ')[0] : 'Conectado';
    } else {
        avatar.src = 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg';
        label.innerText = 'Entrar';
    }
}

const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
    originalSetItem(key, value);
    if (currentUser && !isSyncingFromCloud && key.startsWith('finc_')) {
        syncLocalToCloud();
    }
};

function syncLocalToCloud() {
    if (!currentUser) return;
    const payload = {
        transactions: JSON.parse(localStorage.getItem('finc_transactions') || '[]'),
        categories: JSON.parse(localStorage.getItem('finc_categories') || '[]'),
        methods: JSON.parse(localStorage.getItem('finc_methods') || '[]'),
        shoppingList: JSON.parse(localStorage.getItem('finc_shopping_list') || '[]'),
        targets: JSON.parse(localStorage.getItem('finc_targets') || '{}'),
        activeCurrencies: JSON.parse(localStorage.getItem('finc_active_currencies') || '["JPY","BRL","USD","EUR"]'),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('users').doc(currentUser.uid).set(payload, { merge: true })
        .catch(err => console.error("Erro ao salvar na nuvem:", err));
}

auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    updateAuthUI(user);

    if (user) {
        const docRef = db.collection('users').doc(user.uid);
        const snap = await docRef.get();

        if (!snap.exists && (transactions.length > 0 || shoppingList.length > 0)) {
            syncLocalToCloud();
        }

        docRef.onSnapshot((doc) => {
            if (!doc.exists || doc.metadata.hasPendingWrites) return;
            const data = doc.data();
            isSyncingFromCloud = true;

            if (data.transactions) {
                transactions = data.transactions;
                originalSetItem('finc_transactions', JSON.stringify(transactions));
            }
            if (data.categories && data.categories.length) {
                categories = data.categories;
                originalSetItem('finc_categories', JSON.stringify(categories));
            }
            if (data.methods && data.methods.length) {
                methods = data.methods;
                originalSetItem('finc_methods', JSON.stringify(methods));
            }
            if (data.shoppingList) {
                shoppingList = data.shoppingList;
                originalSetItem('finc_shopping_list', JSON.stringify(shoppingList));
            }
            if (data.targets) {
                targets = data.targets;
                originalSetItem('finc_targets', JSON.stringify(targets));
            }
            if (data.activeCurrencies) {
                activeCurrencies = data.activeCurrencies;
                originalSetItem('finc_active_currencies', JSON.stringify(activeCurrencies));
            }

            isSyncingFromCloud = false;

            if (typeof populateMonthFilterOptions === 'function') populateMonthFilterOptions();
            if (typeof renderDashboard === 'function') renderDashboard();
            if (typeof renderTransactionsTable === 'function') renderTransactionsTable();
            if (typeof renderShoppingList === 'function') renderShoppingList();
        });
    }
});
const i18n = {
    'pt-BR': {
        appTitle: "Controle de Finanças",
        navDash: "Painel / Dashboard",
        navTx: "Transações",
        navShop: "Lista de Compras",
        btnNewTx: "Nova Transação",
        summaryTitle: "Resumo Financeiro",
        summarySub: "Selecione o mês para filtrar as métricas e o gráfico",
        filterMonth: "Mês:",
        allMonths: "Todos os Meses",
        cardBalance: "Saldo Total",
        cardIncome: "Total Receitas",
        cardExpense: "Total Despesas",
        subIncome: "Entradas do período",
        subExpense: "Saídas do período",
        chartTitle: "Gastos por Categoria",
        overview: "Visão Geral (Todos os Meses)",
        recentTx: "Últimas Transações",
        txTableTitle: "Extrato Detalhado",
        txTableSub: "Relação completa de transações da moeda selecionada",
        thDate: "Data",
        thDesc: "Descrição",
        thCat: "Categoria",
        thMethod: "Método",
        thAmount: "Valor",
        thStatus: "Status",
        thNotes: "Obs. / Link",
        thActions: "Ações",
        formDesc: "Descrição",
        formAmount: "Valor",
        formDate: "Data",
        formCat: "Categoria",
        formMethod: "Método",
        formStatus: "Status do Pagamento",
        formNotes: "Observações / Link de Pagamento",
        formCurrency: "Moeda da Transação",
        formRecurring: "Repetir mensalmente (Despesa / Receita Fixa)",
        walletTitle: "Carteira de Moedas",
        btnAddCurrency: "Adicionar Moeda",
        statusPaid: "Pago / Concluído",
        statusPending: "Pendente",
        optStatusPaid: "✅ Pago / Concluído",
        optStatusPending: "⏳ Pendente",
        btnCancel: "Cancelar",
        btnSave: "Salvar",
        modalTitle: "Adicionar Transação",
        positiveBalance: "Balanço Positivo",
        negativeBalance: "Balanço Negativo",
        noRecords: "Sem registros nesta moeda para o período.",
        btnMetas: "Metas",
        targetA: "Meta A",
        targetB: "Meta B",
        targetC: "Meta C",
        inProgress: "🎯 Em progresso",
        targetReached: "🎉 Meta alcançada!",
        targetExpired: "⏰ Prazo expirado",
        availableSpace: "Espaço disponível",
        btnConfigure: "+ Configurar",
        btnDeposit: "Depositar",
        lblAllocated: "Alocado:",
        lblTarget: "Alvo:",
        lblUntil: "Até",
        manageTargets: "Gerenciar Metas Financeiras",
        targetsSub: "As metas são separadas por moeda.",
        addNewTarget: "Adicionar Nova Meta",
        targetName: "Nome da Meta",
        targetAmount: "Valor Alvo",
        targetSaved: "Já Guardado",
        targetLimitDate: "Data Limite",
        btnSaveTarget: "Salvar Meta",
        activeTargets: "Metas Ativas",
        noTargets: "Nenhuma meta cadastrada para esta moeda.",
        depositTitle: "Depositar na Meta",
        depositAmountLbl: "Valor a Guardar / Depositar",
        btnConfirmDeposit: "Confirmar Depósito",
        assignTargetOpt: "Alocar valor para uma Meta? (Opcional)",
        noTargetAssign: "Nenhuma meta (Apenas movimentação)",
        limitReachedAlert: "Você atingiu o limite máximo de 3 metas simultâneas nesta moeda.",
        btnExportJson: "Exportar JSON",
        btnImportJson: "Importar JSON",
        settingsTitle: "Definições e Cópia de Segurança",
        settingsSub: "Gerencie a segurança dos seus dados locais",
        autoBackupFreq: "Frequência do Backup Automático",
        backupInstant: "Instantâneo (A cada alteração)",
        backupDaily: "Diário",
        backupWeekly: "Semanal",
        manualBackupTitle: "Exportar & Importar Manual",
        btnResetData: "Restaurar Dados Iniciais",
        footerSettings: "Definições de Dados",
        footerPrivacy: "Política de Privacidade Local",
        saveStatus: "Dados 100% Salvos e Criptografados no seu Navegador",
        allCategories: "Todas as Categorias",
        allMethods: "Todos os Métodos",
        typeExpense: "Despesa",
        typeIncome: "Receita",
        annualChartTitle: "Comparativo Anual de Gastos (Jan - Dez)",
        annualChartSub: "Evolução mensal de despesas e receitas ao longo do ano",
        filterYear: "Ano:",
        allYears: "Todos os Anos",
        chartExpensesLabel: "Despesas",
        chartIncomeLabel: "Receitas",
        shopTitle: "Lista de Compras de Casa",
        shopSub: "Organize o que falta e lance o total direto nas suas despesas",
        shopCartTotal: "Total no Carrinho",
        btnFinishShop: "Concluir e Lançar Gasto",
        shopItemName: "Item / Produto",
        shopItemQty: "Qtd.",
        shopItemPrice: "Preço Total Item (Opcional)",
        btnAddShop: "Adicionar",
        shopPendingCount: "Itens na Lista",
        btnClearChecked: "Limpar Marcados",
        changelogTitle: "Notas de Atualização (v2.2)",
        shopItemCat: "Categoria",
        shopCategories: {
            breakfast: "☕ Café da Manhã",
            kitchen: "🍳 Cozinha / Despensa",
            cleaning: "🧼 Limpeza",
            hygiene: "🧴 Higiene / Outros"
        },
        changelogItems: [
            "Nova aba Lista de Compras integrada com lançamento direto em despesas.",
            "Filtro 'Todos os Anos' adicionado ao gráfico comparativo anual.",
            "Tradução completa dos seletores de backup e status nos 4 idiomas.",
            "Fechamento automático das janelas ao salvar transações e metas.",
            "Transações recorrentes e filtro de busca por intervalo de datas."
        ],
        categories: { 1: "Aluguel", 2: "Gás", 3: "Energia", 4: "Internet Celular", 5: "Internet Casa", 6: "Água", 7: "Saúde", 8: "Alimentação", 9: "Academia", 10: "Escola", 11: "Entrada / Salário", 12: "Hobby / Lazer", 13: "Outros" },
        methods: { 1: "Cartão de Crédito", 2: "Dinheiro", 3: "Transferência Bancária" }
    },
    en: {
        appTitle: "Financial Control",
        navDash: "Dashboard",
        navTx: "Transactions",
        navShop: "Shopping List",
        btnNewTx: "New Transaction",
        summaryTitle: "Financial Summary",
        summarySub: "Select a month to filter metrics and chart",
        filterMonth: "Month:",
        allMonths: "All Months",
        cardBalance: "Total Balance",
        cardIncome: "Total Income",
        cardExpense: "Total Expenses",
        subIncome: "Inflow for period",
        subExpense: "Outflow for period",
        chartTitle: "Expenses by Category",
        overview: "Overview (All Months)",
        recentTx: "Recent Transactions",
        txTableTitle: "Detailed Statement",
        txTableSub: "Complete list of transactions for selected currency",
        thDate: "Date",
        thDesc: "Description",
        thCat: "Category",
        thMethod: "Method",
        thAmount: "Amount",
        thStatus: "Status",
        thNotes: "Notes / Link",
        thActions: "Actions",
        formDesc: "Description",
        formAmount: "Amount",
        formDate: "Date",
        formCat: "Category",
        formMethod: "Method",
        formStatus: "Payment Status",
        formNotes: "Notes / Link",
        formCurrency: "Transaction Currency",
        formRecurring: "Repeat monthly (Fixed Expense/Income)",
        walletTitle: "Currency Wallet",
        btnAddCurrency: "Add Currency",
        statusPaid: "Paid",
        statusPending: "Pending",
        optStatusPaid: "✅ Paid / Completed",
        optStatusPending: "⏳ Pending",
        btnCancel: "Cancel",
        btnSave: "Save",
        modalTitle: "Add Transaction",
        positiveBalance: "Positive Balance",
        negativeBalance: "Negative Balance",
        noRecords: "No records in this currency for this period.",
        btnMetas: "Goals",
        targetA: "Goal A",
        targetB: "Goal B",
        targetC: "Goal C",
        inProgress: "🎯 In progress",
        targetReached: "🎉 Goal reached!",
        targetExpired: "⏰ Deadline expired",
        availableSpace: "Available slot",
        btnConfigure: "+ Configure",
        btnDeposit: "Deposit",
        lblAllocated: "Allocated:",
        lblTarget: "Target:",
        lblUntil: "Until",
        manageTargets: "Manage Financial Goals",
        targetsSub: "Goals are separated by currency.",
        addNewTarget: "Add New Goal",
        targetName: "Goal Name",
        targetAmount: "Target Amount",
        targetSaved: "Already Saved",
        targetLimitDate: "Deadline Date",
        btnSaveTarget: "Save Goal",
        activeTargets: "Active Goals",
        noTargets: "No goals registered for this currency.",
        depositTitle: "Deposit to Goal",
        depositAmountLbl: "Amount to Save / Deposit",
        btnConfirmDeposit: "Confirm Deposit",
        assignTargetOpt: "Allocate amount to a Goal? (Optional)",
        noTargetAssign: "No goal (Transaction only)",
        limitReachedAlert: "You have reached the maximum limit of 3 simultaneous goals for this currency.",
        btnExportJson: "Export JSON",
        btnImportJson: "Import JSON",
        settingsTitle: "Settings & Backup",
        settingsSub: "Manage your local data security",
        autoBackupFreq: "Automatic Backup Frequency",
        backupInstant: "Instant (On every change)",
        backupDaily: "Daily",
        backupWeekly: "Weekly",
        manualBackupTitle: "Manual Export & Import",
        btnResetData: "Reset Initial Data",
        footerSettings: "Data Settings",
        footerPrivacy: "Local Privacy Policy",
        saveStatus: "100% Data Saved and Encrypted in your Browser",
        allCategories: "All Categories",
        allMethods: "All Payment Methods",
        typeExpense: "Expense",
        typeIncome: "Income",
        annualChartTitle: "Annual Expense Comparison (Jan - Dec)",
        annualChartSub: "Monthly evolution of expenses and income throughout the year",
        filterYear: "Year:",
        allYears: "All Years",
        chartExpensesLabel: "Expenses",
        chartIncomeLabel: "Income",
        shopTitle: "Home Shopping List",
        shopSub: "Organize what you need and log the total directly into expenses",
        shopCartTotal: "Cart Total",
        btnFinishShop: "Finish & Log Expense",
        shopItemName: "Item / Product",
        shopItemQty: "Qty.",
        shopItemPrice: "Total Item Price (Optional)",
        btnAddShop: "Add",
        shopPendingCount: "Items in List",
        btnClearChecked: "Clear Checked",
        changelogTitle: "Update Notes (v2.2)",
        shopItemCat: "Category",
       shopCategories: {
            breakfast: "☕ Breakfast",
            kitchen: "🍳 Kitchen / Pantry",
            cleaning: "🧼 Cleaning",
            hygiene: "🧴 Hygiene / Others"
        },
        changelogItems: [
            "New Shopping List tab with one-click expense logging.",
            "'All Years' filter added to the annual comparison chart.",
            "Full translation of backup and payment status dropdowns.",
            "Auto-closing windows upon saving transactions and goals.",
            "Monthly recurring transactions and date range filters."
        ],
        categories: { 1: "Rent", 2: "Gas", 3: "Electricity", 4: "Mobile Internet", 5: "Home Internet", 6: "Water", 7: "Healthcare", 8: "Food / Groceries", 9: "Gym", 10: "School / Education", 11: "Income / Salary", 12: "Hobby / Leisure", 13: "Others" },
        methods: { 1: "Credit Card", 2: "Cash", 3: "Bank Transfer" }
    },
    ja: {
        appTitle: "家計簿管理システム",
        navDash: "ダッシュボード",
        navTx: "取引履歴",
        navShop: "買い物リスト",
        btnNewTx: "新規取引追加",
        summaryTitle: "財務概要",
        summarySub: "月を選択して指標とグラフを絞り込みます",
        filterMonth: "対象月:",
        allMonths: "すべての月",
        cardBalance: "総収支残高",
        cardIncome: "総収入",
        cardExpense: "総支出",
        subIncome: "期間内の収入",
        subExpense: "期間内の支出",
        chartTitle: "カテゴリ別支出",
        overview: "全体概要 (すべての月)",
        recentTx: "最近の取引履歴",
        txTableTitle: "取引明細",
        txTableSub: "選択した通貨の取引データ一覧",
        thDate: "日付",
        thDesc: "摘要",
        thCat: "カテゴリ",
        thMethod: "決済方法",
        thAmount: "金額",
        thStatus: "ステータス",
        thNotes: "メモ / リンク",
        thActions: "操作",
        formDesc: "内容・摘要",
        formAmount: "金額",
        formDate: "日付",
        formCat: "カテゴリ",
        formMethod: "決済方法",
        formStatus: "支払い状態",
        formNotes: "メモ / リンク",
        formCurrency: "取引通貨",
        formRecurring: "毎月繰り返し設定（固定費・固定収入）",
        walletTitle: "通貨ウォレット",
        btnAddCurrency: "通貨を追加",
        statusPaid: "支払済",
        statusPending: "保留中",
        optStatusPaid: "✅ 支払済 / 完了",
        optStatusPending: "⏳ 保留中",
        btnCancel: "キャンセル",
        btnSave: "保存する",
        modalTitle: "取引の登録",
        positiveBalance: "黒字バランス",
        negativeBalance: "赤字バランス",
        noRecords: "この通貨でのデータはありません。",
        btnMetas: "目標管理",
        targetA: "目標 A",
        targetB: "目標 B",
        targetC: "目標 C",
        inProgress: "🎯 進行中",
        targetReached: "🎉 目標達成！",
        targetExpired: "⏰ 期限切れ",
        availableSpace: "空き枠",
        btnConfigure: "+ 設定する",
        btnDeposit: "入金する",
        lblAllocated: "積立額:",
        lblTarget: "目標額:",
        lblUntil: "期限:",
        manageTargets: "貯金目標の管理",
        targetsSub: "目標は通貨ごとに分かれています。",
        addNewTarget: "新しい目標を追加",
        targetName: "目標名",
        targetAmount: "目標金額",
        targetSaved: "現在の積立額",
        targetLimitDate: "達成期限",
        btnSaveTarget: "目標を保存",
        activeTargets: "有効な目標",
        noTargets: "この通貨の目標はありません。",
        depositTitle: "目標へ入金",
        depositAmountLbl: "積立・入金金額",
        btnConfirmDeposit: "入金を確定",
        assignTargetOpt: "目標に資金を割り当てますか？ (任意)",
        noTargetAssign: "割り当てなし (通常の取引のみ)",
        limitReachedAlert: "この通貨で同時に設定できる目標は最大3つまでです。",
        btnExportJson: "JSON出力",
        btnImportJson: "JSON取込",
        settingsTitle: "設定とバックアップ",
        settingsSub: "ローカルデータのセキュリティ管理",
        autoBackupFreq: "自動バックアップ頻度",
        backupInstant: "即時（変更のたびに保存）",
        backupDaily: "毎日",
        backupWeekly: "毎週",
        manualBackupTitle: "手動エクスポート・インポート",
        btnResetData: "初期データに戻す",
        footerSettings: "データ設定",
        footerPrivacy: "ローカルプライバシーポリシー",
        saveStatus: "データは100%ブラウザ内に暗号化して保存されています",
        allCategories: "すべてのカテゴリ",
        allMethods: "すべての決済方法",
        typeExpense: "支出",
        typeIncome: "収入",
        annualChartTitle: "年間支出比較（1月〜12月）",
        annualChartSub: "1年間の月別支出と収入の推移",
        filterYear: "対象年:",
        allYears: "すべての年",
        chartExpensesLabel: "支出",
        chartIncomeLabel: "収入",
        shopTitle: "日用品・買い物リスト",
        shopSub: "必要なものを管理し、合計金額をそのまま支出に記録します",
        shopCartTotal: "カート合計",
        btnFinishShop: "買い物を完了して支出登録",
        shopItemName: "商品名",
        shopItemQty: "数量",
        shopItemPrice: "合計金額（任意）",
        btnAddShop: "追加",
        shopPendingCount: "リスト内の商品",
        btnClearChecked: "チェック済みを削除",
        changelogTitle: "更新履歴 (v2.2)",
        shopItemCat: "カテゴリ",
        shopCategories: {
    breakfast: "☕ 朝食",
    kitchen: "🍳 キッチン・常備品",
    cleaning: "🧼 掃除・洗剤",
    hygiene: "🧴 日用品・その他"
},
        changelogItems: [
            "支出に直接登録できる「買い物リスト」タブを新設。",
            "年間比較グラフに「すべての年」フィルターを追加。",
            "バックアップ頻度および支払い状態の選択肢を4言語に翻訳。",
            "保存処理完了時のモーダル自動クローズ機能。",
            "固定費の自動繰り返しと日付範囲フィルター機能。"
        ],
        categories: { 1: "家賃", 2: "ガス代", 3: "電気代", 4: "携帯通信費", 5: "固定回線", 6: "水道代", 7: "医療・健康", 8: "食費", 9: "ジム・フィットネス", 10: "教育・学費", 11: "給与・収入", 12: "趣味・娯楽", 13: "その他" },
        methods: { 1: "クレジットカード", 2: "現金", 3: "銀行振込" }
    },
    es: {
        appTitle: "Control Financiero",
        navDash: "Panel / Dashboard",
        navTx: "Transacciones",
        navShop: "Lista de Compras",
        btnNewTx: "Nueva Transacción",
        summaryTitle: "Resumen Financiero",
        summarySub: "Seleccione un mes para filtrar las métricas y el gráfico",
        filterMonth: "Mes:",
        allMonths: "Todos los Meses",
        cardBalance: "Saldo Total",
        cardIncome: "Total Ingresos",
        cardExpense: "Total Gastos",
        subIncome: "Entradas del periodo",
        subExpense: "Salidas del periodo",
        chartTitle: "Gastos por Categoría",
        overview: "Visión General (Todos os Meses)",
        recentTx: "Últimas Transacciones",
        txTableTitle: "Extracto Detallado",
        txTableSub: "Relación completa de transacciones en la moneda seleccionada",
        thDate: "Fecha",
        thDesc: "Descripción",
        thCat: "Categoría",
        thMethod: "Método",
        thAmount: "Monto",
        thStatus: "Estado",
        thNotes: "Obs. / Enlace",
        thActions: "Acciones",
        formDesc: "Descripción",
        formAmount: "Monto",
        formDate: "Fecha",
        formCat: "Categoría",
        formMethod: "Método",
        formStatus: "Estado del Pago",
        formNotes: "Observaciones / Enlace",
        formCurrency: "Moneda de la Transacción",
        formRecurring: "Repetir mensualmente (Gasto/Ingreso Fijo)",
        walletTitle: "Cartera de Monedas",
        btnAddCurrency: "Agregar Moneda",
        statusPaid: "Pagado",
        statusPending: "Pendiente",
        optStatusPaid: "✅ Pagado / Completado",
        optStatusPending: "⏳ Pendiente",
        btnCancel: "Cancelar",
        btnSave: "Guardar",
        modalTitle: "Agregar Transacción",
        positiveBalance: "Balance Positivo",
        negativeBalance: "Balance Negativo",
        noRecords: "Sin registros en esta moneda para este periodo.",
        btnMetas: "Metas",
        targetA: "Meta A",
        targetB: "Meta B",
        targetC: "Meta C",
        inProgress: "🎯 En progreso",
        targetReached: "🎉 ¡Meta alcanzada!",
        targetExpired: "⏰ Plazo expirado",
        availableSpace: "Espacio disponible",
        btnConfigure: "+ Configurar",
        btnDeposit: "Depositar",
        lblAllocated: "Asignado:",
        lblTarget: "Objetivo:",
        lblUntil: "Hasta",
        manageTargets: "Gestionar Metas Financieras",
        targetsSub: "Las metas se separan por moneda.",
        addNewTarget: "Agregar Nueva Meta",
        targetName: "Nombre de la Meta",
        targetAmount: "Monto Objetivo",
        targetSaved: "Ya Guardado",
        targetLimitDate: "Fecha Límite",
        btnSaveTarget: "Guardar Meta",
        activeTargets: "Metas Activas",
        noTargets: "No hay metas en esta moneda.",
        depositTitle: "Depositar en la Meta",
        depositAmountLbl: "Monto a Guardar / Depositar",
        btnConfirmDeposit: "Confirmar Depósito",
        assignTargetOpt: "¿Asignar monto a una Meta? (Opcional)",
        noTargetAssign: "Ninguna meta (Solo movimiento)",
        limitReachedAlert: "Has alcanzado el límite máximo de 3 metas en esta moneda.",
        btnExportJson: "Exportar JSON",
        btnImportJson: "Importar JSON",
        settingsTitle: "Ajustes y Copias de Seguridad",
        settingsSub: "Gestiona la seguridad de tus datos locales",
        autoBackupFreq: "Frecuencia de Copia Automática",
        backupInstant: "Instantáneo (En cada cambio)",
        backupDaily: "Diario",
        backupWeekly: "Semanal",
        manualBackupTitle: "Exportar e Importar Manual",
        btnResetData: "Restaurar Datos Iniciales",
        footerSettings: "Configuración de Datos",
        footerPrivacy: "Política de Privacidad Local",
        saveStatus: "Datos 100% Guardados y Encriptados en su Navegador",
        allCategories: "Todas las Categorías",
        allMethods: "Todos los Métodos",
        typeExpense: "Gasto",
        typeIncome: "Ingreso",
        annualChartTitle: "Comparativa Anual de Gastos (Ene - Dic)",
        annualChartSub: "Evolución mensual de gastos e ingresos durante el año",
        filterYear: "Año:",
        allYears: "Todos los Años",
        chartExpensesLabel: "Gastos",
        chartIncomeLabel: "Ingresos",
        shopTitle: "Lista de Compras del Hogar",
        shopSub: "Organiza lo que falta y registra el total directamente en tus gastos",
        shopCartTotal: "Total en Carrito",
        btnFinishShop: "Finalizar y Registrar Gasto",
        shopItemName: "Artículo / Producto",
        shopItemQty: "Cant.",
        shopItemPrice: "Precio Total (Opcional)",
        btnAddShop: "Agregar",
        shopPendingCount: "Artículos en Lista",
        btnClearChecked: "Limpiar Marcados",
        changelogTitle: "Notas de Actualización (v2.2)",
        shopItemCat: "Categoría",
shopCategories: {
    breakfast: "☕ Desayuno",
    kitchen: "🍳 Cocina / Despensa",
    cleaning: "🧼 Limpieza",
    hygiene: "🧴 Higiene / Otros"
},
        changelogItems: [
            "Nueva pestaña Lista de Compras con registro directo de gastos.",
            "Filtro 'Todos los Años' añadido al gráfico comparativo anual.",
            "Traducción completa de los selectores de respaldo y estado.",
            "Cierre automático de ventanas al guardar transacciones y metas.",
            "Transacciones recurrentes mensuales y filtros por rango de fechas."
        ],
        categories: { 1: "Alquiler", 2: "Gas", 3: "Electricidad", 4: "Internet Móvil", 5: "Internet Hogar", 6: "Agua", 7: "Salud", 8: "Alimentación", 9: "Gimnasio", 10: "Escuela / Educación", 11: "Ingreso / Salario", 12: "Hobby / Ocio", 13: "Otros" },
        methods: { 1: "Tarjeta de Crédito", 2: "Efectivo", 3: "Transferencia Bancaria" }
    }
};

const currencyConfig = {
    JPY: { code: 'JPY', symbol: '¥', name: 'Iene', flag: '🇯🇵', locale: 'ja-JP', decimals: 0 },
    BRL: { code: 'BRL', symbol: 'R$', name: 'Real', flag: '🇧🇷', locale: 'pt-BR', decimals: 2 },
    USD: { code: 'USD', symbol: '$', name: 'Dólar', flag: '🇺🇸', locale: 'en-US', decimals: 2 },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', locale: 'de-DE', decimals: 2 }
};

const langDetails = {
    'pt-BR': { flag: 'https://flagcdn.com/w20/br.png', label: 'PT' },
    en: { flag: 'https://flagcdn.com/w20/us.png', label: 'EN' },
    ja: { flag: 'https://flagcdn.com/w20/jp.png', label: 'JA' },
    es: { flag: 'https://flagcdn.com/w20/es.png', label: 'ES' }
};

let currentLang = localStorage.getItem('finc_lang') || 'pt-BR';
let currentCurrency = localStorage.getItem('finc_active_currency') || 'BRL';
let activeCurrencies = JSON.parse(localStorage.getItem('finc_active_currencies')) || ['BRL'];

const initialCategories = [
    { id: 1, name: 'Aluguel', type: 'Despesa' },
    { id: 2, name: 'Gás', type: 'Despesa' },
    { id: 3, name: 'Energia', type: 'Despesa' },
    { id: 4, name: 'Internet Celular', type: 'Despesa' },
    { id: 5, name: 'Internet Casa', type: 'Despesa' },
    { id: 6, name: 'Água', type: 'Despesa' },
    { id: 7, name: 'Saúde', type: 'Despesa' },
    { id: 8, name: 'Alimentação', type: 'Despesa' },
    { id: 9, name: 'Academia', type: 'Despesa' },
    { id: 10, name: 'Escola', type: 'Despesa' },
    { id: 11, name: 'Entrada / Salário', type: 'Receita' },
    { id: 12, name: 'Hobby / Lazer', type: 'Despesa' },
    { id: 13, name: 'Outros', type: 'Despesa' }
];

const initialMethods = [
    { id: 1, name: 'Cartão de Crédito' },
    { id: 2, name: 'Dinheiro' },
    { id: 3, name: 'Transferência Bancária' }
];

const initialTransactions = [
    { id: 1, description: 'Salário Exemplo', amount: 3500.00, currency: 'BRL', date: '2026-10-01', categoryId: 11, paymentMethodId: 3, status: 'paid', isRecurring: true, notes: 'Receita fixa mensal' },
    { id: 2, description: 'Supermercado Modelo', amount: 450.50, currency: 'BRL', date: '2026-10-05', categoryId: 8, paymentMethodId: 1, status: 'paid', isRecurring: false, notes: 'Compras para a casa' },
    { id: 3, description: 'Conta de Luz Exemplo', amount: 180.20, currency: 'BRL', date: '2026-10-10', categoryId: 3, paymentMethodId: 3, status: 'pending', isRecurring: true, notes: 'Vencimento dia 10' }
];

if (!localStorage.getItem('finc_transactions')) {
    localStorage.setItem('finc_categories', JSON.stringify(initialCategories));
    localStorage.setItem('finc_methods', JSON.stringify(initialMethods));
    localStorage.setItem('finc_transactions', JSON.stringify(initialTransactions));
    localStorage.setItem('finc_active_currencies', JSON.stringify(activeCurrencies));
}

let categories = JSON.parse(localStorage.getItem('finc_categories')) || initialCategories;
let methods = JSON.parse(localStorage.getItem('finc_methods')) || initialMethods;
let transactions = JSON.parse(localStorage.getItem('finc_transactions')) || [];

transactions = transactions.map(tx => ({
    ...tx,
    currency: tx.currency || 'BRL',
    isRecurring: tx.isRecurring || false
}));

let shoppingList = JSON.parse(localStorage.getItem('finc_shopping_list')) || [
    { id: 1, name: 'Arroz (5kg)', qty: '1 pct', price: 0, checked: false, currency: currentCurrency },
    { id: 2, name: 'Leite Integral', qty: '2 cx', price: 0, checked: false, currency: currentCurrency }
];

let myChart = null;
let annualChart = null;

function processRecurringTransactions() {
    const today = new Date();
    const currentMonthStr = today.toISOString().substring(0, 7);
    let hasNewItems = false;

    const recurringItems = transactions.filter(t => t.isRecurring);

    recurringItems.forEach(item => {
        const itemMonth = item.date.substring(0, 7);
        if (itemMonth < currentMonthStr) {
            const dayPart = item.date.substring(8, 10);
            const expectedNewDate = `${currentMonthStr}-${dayPart}`;

            const alreadyExists = transactions.some(t => 
                t.description === item.description && 
                t.amount === item.amount && 
                t.currency === item.currency &&
                t.date.substring(0, 7) === currentMonthStr
            );

            if (!alreadyExists) {
                transactions.push({
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    description: item.description,
                    amount: item.amount,
                    currency: item.currency,
                    date: expectedNewDate,
                    categoryId: item.categoryId,
                    paymentMethodId: item.paymentMethodId,
                    status: 'pending',
                    isRecurring: true,
                    notes: item.notes || ''
                });
                hasNewItems = true;
            }
        }
    });

    if (hasNewItems) {
        localStorage.setItem('finc_transactions', JSON.stringify(transactions));
    }
}

function getCategoryName(cat) {
    if (!cat) return 'N/A';
    const t = i18n[currentLang] || i18n['pt-BR'];
    return (t.categories && t.categories[cat.id]) ? t.categories[cat.id] : (cat.name || 'N/A');
}

function getMethodName(method) {
    if (!method) return 'N/A';
    const t = i18n[currentLang] || i18n['pt-BR'];
    return (t.methods && t.methods[method.id]) ? t.methods[method.id] : (method.name || 'N/A');
}

function getTargetColors() {
    const t = i18n[currentLang] || i18n['pt-BR'];
    return [
        { key: 'targetA', name: t.targetA, bg: 'bg-indigo-600', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500', btnBg: 'bg-indigo-600 hover:bg-indigo-700' },
        { key: 'targetB', name: t.targetB, bg: 'bg-pink-500', text: 'text-pink-500 dark:text-pink-400', border: 'border-pink-500', btnBg: 'bg-pink-500 hover:bg-pink-600' },
        { key: 'targetC', name: t.targetC, bg: 'bg-emerald-500', text: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-500', btnBg: 'bg-emerald-500 hover:bg-emerald-600' }
    ];
}

window.addEventListener('DOMContentLoaded', () => {
    processRecurringTransactions();

    const txDateInput = document.getElementById('tx-date');
    if (txDateInput) txDateInput.value = new Date().toISOString().split('T')[0];

    if (langDetails[currentLang]) {
        const flagImg = document.getElementById('current-lang-flag');
        const flagLbl = document.getElementById('current-lang-label');
        if (flagImg) flagImg.src = langDetails[currentLang].flag;
        if (flagLbl) flagLbl.innerText = langDetails[currentLang].label;
    }

    const txCurrSelect = document.getElementById('tx-currency');
    if (txCurrSelect) txCurrSelect.value = currentCurrency;

    updateLanguage();
    populateMonthFilterOptions();
    renderWalletCards();
    renderDashboard();
    renderTransactionsTable();
    renderShoppingList();
});

function formatCurrency(val, code = currentCurrency) {
    const conf = currencyConfig[code] || currencyConfig.BRL;
    return new Intl.NumberFormat(conf.locale, {
        style: 'currency',
        currency: conf.code,
        minimumFractionDigits: conf.decimals,
        maximumFractionDigits: conf.decimals
    }).format(val);
}

function toggleAddCurrencyDropdown() {
    const menu = document.getElementById('add-currency-menu');
    if (menu) menu.classList.toggle('hidden');
}

function activateCurrency(code) {
    if (!activeCurrencies.includes(code)) {
        activeCurrencies.push(code);
        localStorage.setItem('finc_active_currencies', JSON.stringify(activeCurrencies));
    }

    const menu = document.getElementById('add-currency-menu');
    if (menu) menu.classList.add('hidden');

    switchCurrency(code);
}

function switchCurrency(code) {
    currentCurrency = code;
    localStorage.setItem('finc_active_currency', code);

    const txCurrSelect = document.getElementById('tx-currency');
    if (txCurrSelect) txCurrSelect.value = code;

    populateMonthFilterOptions();
    renderWalletCards();
    renderDashboard();
    renderTransactionsTable();
    renderShoppingList();
}

function renderWalletCards() {
    const walletContainer = document.getElementById('active-currencies-cards');
    if (!walletContainer) return;

    const usedCurrencies = new Set(activeCurrencies);
    transactions.forEach(t => usedCurrencies.add(t.currency || 'BRL'));

    const displayCurrencies = Array.from(usedCurrencies);
    walletContainer.innerHTML = '';

    displayCurrencies.forEach(code => {
        const conf = currencyConfig[code];
        if (!conf) return;

        let balance = 0;
        transactions.filter(t => t.currency === code).forEach(t => {
            const cat = categories.find(c => c.id === Number(t.categoryId));
            const amt = Number(t.amount || 0);
            if (cat && (cat.type === 'Receita' || cat.tipo === 'Receita')) {
                balance += amt;
            } else {
                balance -= amt;
            }
        });

        const isActive = code === currentCurrency;

        walletContainer.innerHTML += `
            <div onclick="switchCurrency('${code}')" 
                 class="cursor-pointer px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md ${
                     isActive 
                     ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-900/40 ring-1 ring-indigo-500/30' 
                     : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                 }">
                <div class="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                    <span>${conf.flag}</span>
                    <span>${conf.code}</span>
                </div>
                <span class="font-extrabold text-slate-900 dark:text-white">
                    ${formatCurrency(balance, code)}
                </span>
                ${isActive ? '<span class="w-2 h-2 rounded-full bg-indigo-600"></span>' : ''}
            </div>
        `;
    });
}

function toggleLangDropdown() {
    const menu = document.getElementById('lang-dropdown-menu');
    if (menu) menu.classList.toggle('hidden');
}

function selectLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('finc_lang', lang);

    const flagImg = document.getElementById('current-lang-flag');
    const flagLbl = document.getElementById('current-lang-label');
    if (flagImg) flagImg.src = langDetails[lang].flag;
    if (flagLbl) flagLbl.innerText = langDetails[lang].label;

    const menu = document.getElementById('lang-dropdown-menu');
    if (menu) menu.classList.add('hidden');

    updateLanguage();
    populateMonthFilterOptions();
    renderDashboard();
    renderTransactionsTable();
    renderShoppingList();
}

window.addEventListener('click', (e) => {
    const containerLang = document.getElementById('dropdown-lang-container');
    const menuLang = document.getElementById('lang-dropdown-menu');
    if (containerLang && menuLang && !containerLang.contains(e.target)) {
        menuLang.classList.add('hidden');
    }

    const containerCurr = document.getElementById('dropdown-add-currency-container');
    const menuCurr = document.getElementById('add-currency-menu');
    if (containerCurr && menuCurr && !containerCurr.contains(e.target)) {
        menuCurr.classList.add('hidden');
    }
});

function updateLanguage() {
    const t = i18n[currentLang] || i18n['pt-BR'];

    const elementsMap = {
        'app-title': t.appTitle,
        'lbl-nav-dash': t.navDash,
        'lbl-nav-tx': t.navTx,
        'lbl-nav-shop': t.navShop,
        'lbl-btn-new-tx': t.btnNewTx,
        'lbl-summary-title': t.summaryTitle,
        'lbl-summary-sub': t.summarySub,
        'lbl-filter-month': t.filterMonth,
        'lbl-card-balance': t.cardBalance,
        'lbl-card-income': t.cardIncome,
        'lbl-card-expense': t.cardExpense,
        'lbl-sub-income': t.subIncome,
        'lbl-sub-expense': t.subExpense,
        'lbl-chart-title': t.chartTitle,
        'lbl-recent-tx': t.recentTx,
        'lbl-tx-table-title': t.txTableTitle,
        'lbl-tx-table-sub': t.txTableSub,
        'th-date': t.thDate,
        'th-desc': t.thDesc,
        'th-cat': t.thCat,
        'th-method': t.thMethod,
        'th-amount': t.thAmount,
        'th-status': t.thStatus,
        'th-notes': t.thNotes,
        'th-actions': t.thActions,
        'lbl-form-desc': t.formDesc,
        'lbl-form-amount': t.formAmount,
        'lbl-form-date': t.formDate,
        'lbl-form-cat': t.formCat,
        'lbl-form-method': t.formMethod,
        'lbl-form-status': t.formStatus,
        'lbl-form-notes': t.formNotes,
        'lbl-form-currency': t.formCurrency,
        'lbl-form-recurring': t.formRecurring,
        'lbl-wallet-title': t.walletTitle,
        'btn-add-currency-lbl': t.btnAddCurrency,
        'btn-cancel': t.btnCancel,
        'btn-save': t.btnSave,
        'modal-tx-title': t.modalTitle,
        'btn-metas-lbl': t.btnMetas,
        'modal-targets-manage-title': t.manageTargets,
        'modal-targets-manage-sub': t.targetsSub,
        'lbl-add-new-target': t.addNewTarget,
        'lbl-target-name-input': t.targetName,
        'lbl-target-amount-input': t.targetAmount,
        'lbl-target-saved-input': t.targetSaved,
        'lbl-target-date-input': t.targetLimitDate,
        'btn-add-target-text': t.btnSaveTarget,
        'lbl-active-targets-title': t.activeTargets,
        'lbl-assign-target-opt': t.assignTargetOpt,
        'btn-deposit-confirm': t.btnConfirmDeposit,
        'lbl-deposit-amount-input': t.depositAmountLbl,
        'lbl-btn-export-json': t.btnExportJson,
        'lbl-btn-import-json': t.btnImportJson,
        'modal-settings-title': t.settingsTitle,
        'modal-settings-sub': t.settingsSub,
        'lbl-manual-backup-title': t.manualBackupTitle,
        'lbl-btn-reset-data': t.btnResetData,
        'lbl-save-status': t.saveStatus,
        'lbl-footer-settings': t.footerSettings,
        'lbl-footer-privacy': t.footerPrivacy,
        'lbl-changelog-title': t.changelogTitle,
        'lbl-annual-chart-title': t.annualChartTitle,
        'lbl-annual-chart-sub': t.annualChartSub,
        'lbl-filter-year': t.filterYear,
        'lbl-shop-title': t.shopTitle,
        'lbl-shop-sub': t.shopSub,
        'lbl-shop-cart-total': t.shopCartTotal,
        'lbl-btn-finish-shop': t.btnFinishShop,
        'lbl-shop-item-name': t.shopItemName,
        'lbl-shop-item-qty': t.shopItemQty,
        'lbl-shop-item-price': t.shopItemPrice,
        'lbl-btn-add-shop': t.btnAddShop,
        'lbl-shop-pending-count': t.shopPendingCount,
        'lbl-btn-clear-checked': t.btnClearChecked
    };

    Object.keys(elementsMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = elementsMap[id];
    });

    const autoBackupLbl = document.getElementById('lbl-auto-backup-freq');
    if (autoBackupLbl) {
        autoBackupLbl.innerHTML = `<i class="fa-solid fa-rotate mr-1 text-indigo-500"></i> ${t.autoBackupFreq}`;
    }

    const backupSelect = document.getElementById('auto-backup-frequency');
    if (backupSelect) {
        const currentVal = backupSelect.value || 'instant';
        backupSelect.innerHTML = `
            <option value="instant">${t.backupInstant}</option>
            <option value="daily">${t.backupDaily}</option>
            <option value="weekly">${t.backupWeekly}</option>
        `;
        backupSelect.value = currentVal;
    }

    const statusSelect = document.getElementById('tx-status');
    if (statusSelect) {
        const currentStatus = statusSelect.value || 'paid';
        statusSelect.innerHTML = `
            <option value="paid">${t.optStatusPaid}</option>
            <option value="pending">${t.optStatusPending}</option>
        `;
        statusSelect.value = currentStatus;
    }

    const changelogList = document.getElementById('changelog-list');
    if (changelogList && t.changelogItems) {
        changelogList.innerHTML = t.changelogItems.map(item => `<li>${item}</li>`).join('');
    }

    document.querySelectorAll('.lbl-btn-new-tx-sub').forEach(el => el.innerText = t.btnNewTx);

    updateCategoryDropdowns();
    updateMethodDropdowns();
    renderModalTargetsList();
    updateTargetAssignDropdown();
}

function populateMonthFilterOptions(selectedMonthValue = null) {
    const filterSelect = document.getElementById('dash-month-filter');
    if (!filterSelect) return;

    const currentSelected = selectedMonthValue || filterSelect.value || 'ALL';
    const t = i18n[currentLang] || i18n['pt-BR'];

    const monthsSet = new Set();
    transactions.filter(tx => tx.currency === currentCurrency).forEach(tx => {
        if (tx.date && tx.date.length >= 7) {
            monthsSet.add(tx.date.substring(0, 7));
        }
    });

    const sortedMonths = Array.from(monthsSet).sort().reverse();
    filterSelect.innerHTML = `<option value="ALL">${t.allMonths}</option>`;

    sortedMonths.forEach(m => {
        const [year, month] = m.split('-');
        const langLocale = currentLang === 'ja' ? 'ja-JP' : 
                           currentLang === 'es' ? 'es-ES' : 
                           currentLang === 'en' ? 'en-US' : 'pt-BR';
        const monthName = new Date(year, month - 1).toLocaleString(langLocale, { month: 'long' });
        const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        filterSelect.innerHTML += `<option value="${m}">${capitalized} / ${year}</option>`;
    });

    if (Array.from(filterSelect.options).some(opt => opt.value === currentSelected)) {
        filterSelect.value = currentSelected;
    } else {
        filterSelect.value = 'ALL';
    }
}

function renderDashboard() {
    const filterSelect = document.getElementById('dash-month-filter');
    if (!filterSelect) return;

    const selectedMonth = filterSelect.value;
    const periodBadge = document.getElementById('chart-period-badge');
    const t = i18n[currentLang] || i18n['pt-BR'];

    if (periodBadge) {
        if (selectedMonth === 'ALL') {
            periodBadge.innerText = t.overview;
        } else if (filterSelect.options[filterSelect.selectedIndex]) {
            periodBadge.innerText = filterSelect.options[filterSelect.selectedIndex].text;
        }
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCatMap = {};

    const filteredTx = transactions.filter(tx => {
        const isCurrentCurr = (tx.currency || 'BRL') === currentCurrency;
        if (!isCurrentCurr) return false;
        if (selectedMonth === 'ALL') return true;
        return tx.date && tx.date.startsWith(selectedMonth);
    });

    filteredTx.forEach(tx => {
        const catId = tx.categoryId;
        const cat = categories.find(c => c.id === Number(catId));
        const amount = Number(tx.amount || 0);

        if (cat) {
            const catTranslatedName = getCategoryName(cat);
            if (cat.type === 'Receita') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
                expenseByCatMap[catTranslatedName] = (expenseByCatMap[catTranslatedName] || 0) + amount;
            }
        }
    });

    const balance = totalIncome - totalExpense;
    const cardBal = document.getElementById('card-balance');
    const cardInc = document.getElementById('card-income');
    const cardExp = document.getElementById('card-expense');
    
    if (cardBal) cardBal.innerText = formatCurrency(balance);
    if (cardInc) cardInc.innerText = formatCurrency(totalIncome);
    if (cardExp) cardExp.innerText = formatCurrency(totalExpense);

    const badge = document.getElementById('balance-status-badge');
    if (badge) {
        if (balance >= 0) {
            badge.innerText = t.positiveBalance;
            badge.className = "mt-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
        } else {
            badge.innerText = t.negativeBalance;
            badge.className = "mt-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300";
        }
    }

    const sortedTx = [...filteredTx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
    const recentContainer = document.getElementById('recent-transactions-list');
    if (recentContainer) {
        recentContainer.innerHTML = '';
        if (sortedTx.length === 0) {
            recentContainer.innerHTML = `<p class="text-xs text-slate-400 italic">${t.noRecords}</p>`;
        } else {
            sortedTx.forEach(tx => {
                const catId = tx.categoryId;
                const cat = categories.find(c => c.id === Number(catId)) || { id: 13, name: 'Outros', type: 'Despesa' };
                const catName = getCategoryName(cat);
                const isIncome = cat.type === 'Receita';
                const amount = Number(tx.amount || 0);

                recentContainer.innerHTML += `
                    <div class="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                        <div>
                            <p class="font-medium text-slate-800 dark:text-slate-200">${tx.description} ${tx.isRecurring ? '<i class="fa-solid fa-rotate text-indigo-500 text-[10px]" title="Recorrente"></i>' : ''}</p>
                            <p class="text-[10px] text-slate-400">${catName} • ${tx.date}</p>
                        </div>
                        <span class="font-semibold ${isIncome ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}">
                            ${isIncome ? '+' : '-'}${formatCurrency(amount)}
                        </span>
                    </div>
                `;
            });
        }
    }

    renderChart(expenseByCatMap);
    updateTargetUI();
    renderWalletCards();
    renderAnnualChart();
}

function renderChart(dataMap) {
    const canvas = document.getElementById('expensesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const labels = Object.keys(dataMap);
    const values = Object.values(dataMap);
    const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#06b6d4', '#f43f5e'];

    const total = values.reduce((acc, curr) => acc + curr, 0);

    if (myChart) myChart.destroy();

    if (labels.length === 0) {
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: ['N/A'], datasets: [{ data: [1], backgroundColor: ['#e2e8f0'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
        return;
    }

    const plugins = typeof ChartDataLabels !== 'undefined' ? [ChartDataLabels] : [];

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{ data: values, backgroundColor: colors.slice(0, labels.length), borderWidth: 2, borderColor: '#ffffff' }]
        },
        plugins: plugins,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { position: 'right' },
                tooltip: { 
                    callbacks: { 
                        label: (ctx) => {
                            const val = ctx.raw;
                            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                            return ` ${ctx.label}: ${formatCurrency(val)} (${pct}%)`;
                        } 
                    } 
                },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold', size: 11 },
                    formatter: (value) => {
                        const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                        return pct > 4 ? `${pct}%` : '';
                    }
                }
            }
        }
    });
}

function renderAnnualChart() {
    const canvas = document.getElementById('annualExpensesChart');
    const yearSelect = document.getElementById('annual-year-filter');
    if (!canvas || !yearSelect) return;

    const t = i18n[currentLang] || i18n['pt-BR'];
    const currentYear = String(new Date().getFullYear());

    const yearsSet = new Set([currentYear]);
    transactions
        .filter(tx => (tx.currency || 'BRL') === currentCurrency && tx.date && tx.date.length >= 4)
        .forEach(tx => yearsSet.add(tx.date.substring(0, 4)));

    const sortedYears = Array.from(yearsSet).sort().reverse();
    const prevSelectedYear = yearSelect.value;

    yearSelect.innerHTML = `<option value="ALL">${t.allYears}</option>` +
        sortedYears.map(y => `<option value="${y}">${y}</option>`).join('');

    if (prevSelectedYear === 'ALL' || sortedYears.includes(prevSelectedYear)) {
        yearSelect.value = prevSelectedYear;
    } else {
        yearSelect.value = currentYear;
    }

    const selectedYear = yearSelect.value;

    const monthlyExpenses = new Array(12).fill(0);
    const monthlyIncome = new Array(12).fill(0);

    transactions.forEach(tx => {
        if ((tx.currency || 'BRL') !== currentCurrency) return;
        if (!tx.date || tx.date.length < 7) return;
        if (selectedYear !== 'ALL' && !tx.date.startsWith(selectedYear)) return;

        const monthIndex = parseInt(tx.date.substring(5, 7), 10) - 1;
        if (monthIndex < 0 || monthIndex > 11) return;

        const cat = categories.find(c => c.id === Number(tx.categoryId));
        const amount = Number(tx.amount || 0);

        if (cat && cat.type === 'Receita') {
            monthlyIncome[monthIndex] += amount;
        } else {
            monthlyExpenses[monthIndex] += amount;
        }
    });

    const langLocale = currentLang === 'ja' ? 'ja-JP' :
                       currentLang === 'es' ? 'es-ES' :
                       currentLang === 'en' ? 'en-US' : 'pt-BR';

    const refYear = selectedYear === 'ALL' ? Number(currentYear) : Number(selectedYear);
    const monthLabels = Array.from({ length: 12 }, (_, i) => {
        const label = new Date(refYear, i, 1).toLocaleString(langLocale, { month: 'short' });
        return label.charAt(0).toUpperCase() + label.slice(1).replace('.', '');
    });

    if (annualChart) annualChart.destroy();

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.2)';
    const textColor = isDark ? '#cbd5e1' : '#475569';

    annualChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [
                {
                    label: t.chartExpensesLabel,
                    data: monthlyExpenses,
                    backgroundColor: '#f43f5e',
                    borderRadius: 6,
                    maxBarThickness: 28
                },
                {
                    label: t.chartIncomeLabel,
                    data: monthlyIncome,
                    backgroundColor: '#10b981',
                    borderRadius: 6,
                    maxBarThickness: 28
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: textColor, usePointStyle: true, boxWidth: 8 }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        callback: (value) => formatCurrency(value)
                    }
                }
            }
        }
    });
}

function renderTransactionsTable() {
    const tbody = document.getElementById('transactions-table-body');
    if (!tbody) return;

    const t = i18n[currentLang] || i18n['pt-BR'];
    const searchText = (document.getElementById('tx-search-input')?.value || '').toLowerCase().trim();
    const filterCat = document.getElementById('tx-filter-category')?.value || 'ALL';
    const filterMethod = document.getElementById('tx-filter-method')?.value || 'ALL';
    const filterStatus = document.getElementById('tx-filter-status')?.value || 'ALL';
    
    const filterDateStart = document.getElementById('tx-filter-date-start')?.value || '';
    const filterDateEnd = document.getElementById('tx-filter-date-end')?.value || '';

    tbody.innerHTML = '';

    const filteredList = transactions.filter(tx => {
        if ((tx.currency || 'BRL') !== currentCurrency) return false;

        const catId = String(tx.categoryId);
        const methodId = String(tx.paymentMethodId);
        const desc = (tx.description || '').toLowerCase();
        const notes = (tx.notes || '').toLowerCase();

        const matchSearch = !searchText || desc.includes(searchText) || notes.includes(searchText);
        const matchCat = filterCat === 'ALL' || catId === filterCat;
        const matchMethod = filterMethod === 'ALL' || methodId === filterMethod;
        const matchStatus = filterStatus === 'ALL' || tx.status === filterStatus;
        
        const matchStart = !filterDateStart || tx.date >= filterDateStart;
        const matchEnd = !filterDateEnd || tx.date <= filterDateEnd;

        return matchSearch && matchCat && matchMethod && matchStatus && matchStart && matchEnd;
    });

    const sortedList = [...filteredList].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-xs text-slate-400 italic">${t.noRecords}</td></tr>`;
        return;
    }

    sortedList.forEach(tx => {
        const catId = tx.categoryId;
        const methodId = tx.paymentMethodId;
        const cat = categories.find(c => c.id === Number(catId)) || { id: 13, name: 'Outros', type: 'Despesa' };
        const method = methods.find(m => m.id === Number(methodId)) || { id: 2, name: 'Dinheiro' };
        
        const catName = getCategoryName(cat);
        const methodName = getMethodName(method);

        const isIncome = cat.type === 'Receita';
        const amount = Number(tx.amount || 0);

        const isPaid = tx.status === 'paid';
        const statusBadge = isPaid
            ? `<button onclick="toggleTxStatus(${tx.id})" class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 hover:opacity-80 transition cursor-pointer"><i class="fa-solid fa-check mr-1"></i>${t.statusPaid}</button>`
            : `<button onclick="toggleTxStatus(${tx.id})" class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 hover:opacity-80 transition cursor-pointer"><i class="fa-solid fa-clock mr-1"></i>${t.statusPending}</button>`;

        let notesDisplay = '-';
        if (tx.notes && tx.notes.trim() !== '') {
            const isUrl = tx.notes.startsWith('http://') || tx.notes.startsWith('https://');
            if (isUrl) {
                notesDisplay = `<a href="${tx.notes}" target="_blank" class="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg"><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> Link</a>`;
            } else {
                notesDisplay = `<span class="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[150px] inline-block" title="${tx.notes}">${tx.notes}</span>`;
            }
        }

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="p-4 text-slate-500 text-xs">${tx.date}</td>
                <td class="p-4 font-medium text-slate-800 dark:text-slate-200 text-xs">
                    ${tx.description}
                    ${tx.isRecurring ? '<i class="fa-solid fa-rotate text-indigo-500 text-[10px] ml-1" title="Fixa/Recorrente"></i>' : ''}
                </td>
                <td class="p-4"><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700">${catName}</span></td>
                <td class="p-4 text-slate-600 dark:text-slate-400 text-xs">${methodName}</td>
                <td class="p-4 text-right font-bold text-xs ${isIncome ? 'text-emerald-600' : ''}">${isIncome ? '+' : '-'}${formatCurrency(amount, tx.currency)}</td>
                <td class="p-4 text-center">${statusBadge}</td>
                <td class="p-4 text-center">${notesDisplay}</td>
                <td class="p-4 text-center">
                    <button onclick="deleteTransaction(${tx.id})" class="text-slate-400 hover:text-rose-600 p-1"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function saveTransaction(e) {
    e.preventDefault();
    const desc = document.getElementById('tx-desc').value.trim();
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const date = document.getElementById('tx-date').value;
    const catId = Number(document.getElementById('tx-category').value);
    const methodId = Number(document.getElementById('tx-method').value);
    const status = document.getElementById('tx-status').value;
    const notes = document.getElementById('tx-notes').value.trim();
    const txCurrency = document.getElementById('tx-currency').value;
    const assignedTargetId = document.getElementById('tx-target-assign').value;
    const isRecurring = document.getElementById('tx-is-recurring')?.checked || false;

    const txMonth = date.substring(0, 7);

    transactions.push({
        id: Date.now(),
        description: desc,
        amount: amount,
        currency: txCurrency,
        date: date,
        categoryId: catId,
        paymentMethodId: methodId,
        status: status,
        isRecurring: isRecurring,
        notes: notes
    });

    if (assignedTargetId) {
        let targets = getTargets();
        const targetIndex = targets.findIndex(t => t.id === Number(assignedTargetId));
        if (targetIndex !== -1) {
            targets[targetIndex].saved = (targets[targetIndex].saved || 0) + amount;
            localStorage.setItem('finc_targets_list', JSON.stringify(targets));
        }
    }

    if (!activeCurrencies.includes(txCurrency)) {
        activeCurrencies.push(txCurrency);
        localStorage.setItem('finc_active_currencies', JSON.stringify(activeCurrencies));
    }

    currentCurrency = txCurrency;
    localStorage.setItem('finc_active_currency', currentCurrency);
    localStorage.setItem('finc_transactions', JSON.stringify(transactions));

    populateMonthFilterOptions(txMonth);
    renderWalletCards();
    renderDashboard();
    renderTransactionsTable();
    triggerAutoBackup();
    
    closeModal('modal-transaction');
    document.getElementById('form-transaction').reset();
    document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('tx-currency').value = currentCurrency;
}

// ==========================================
// MÓDULO: LISTA DE COMPRAS INTELIGENTE
// ==========================================
function saveShoppingList() {
    localStorage.setItem('finc_shopping_list', JSON.stringify(shoppingList));
    renderShoppingList();
    triggerAutoBackup();
}

function addShoppingItem(e) {
    e.preventDefault();
    const nameInput = document.getElementById('shop-item-name');
    const qtyInput = document.getElementById('shop-item-qty');
    const priceInput = document.getElementById('shop-item-price');

    const name = nameInput.value.trim();
    const qty = qtyInput.value.trim() || '1';
    const price = parseFloat(priceInput.value) || 0;

    if (!name) return;

    shoppingList.unshift({
        id: Date.now(),
        name,
        qty,
        price,
        checked: false,
        currency: currentCurrency
    });

    nameInput.value = '';
    qtyInput.value = '1';
    priceInput.value = '';
    saveShoppingList();
}

function toggleShoppingItem(id) {
    const item = shoppingList.find(i => i.id === id);
    if (item) {
        item.checked = !item.checked;
        saveShoppingList();
    }
}
function updateShoppingCategoryDropdown() {
    const t = i18n[currentLang] || i18n['pt-BR'];
    const catSelect = document.getElementById('shop-item-cat');
    const lblCat = document.getElementById('lbl-shop-item-cat');
    if (lblCat) lblCat.innerText = t.shopItemCat || "Categoria";
    if (!catSelect || !t.shopCategories) return;

    const currentVal = catSelect.value || 'breakfast';
    catSelect.innerHTML = Object.entries(t.shopCategories)
        .map(([key, label]) => `<option value="${key}">${label}</option>`)
        .join('');
    catSelect.value = currentVal;
}
function addShoppingItem(e) {
    e.preventDefault();
    const nameInput = document.getElementById('shop-item-name');
    const catInput = document.getElementById('shop-item-cat');
    const qtyInput = document.getElementById('shop-item-qty');
    const priceInput = document.getElementById('shop-item-price');

    const name = nameInput.value.trim();
    const category = catInput ? catInput.value : 'kitchen';
    const qty = qtyInput.value.trim() || '1';
    const price = parseFloat(priceInput.value) || 0;

    if (!name) return;

    shoppingList.unshift({
        id: Date.now(),
        name,
        category,
        qty,
        price,
        checked: false,
        currency: currentCurrency
    });

    nameInput.value = '';
    qtyInput.value = '1';
    priceInput.value = '';
    saveShoppingList();
}

function updateShoppingItemQty(id, newQty) {
    const item = shoppingList.find(i => i.id === id);
    if (item) {
        const trimmed = String(newQty).trim();
        item.qty = trimmed || '1';
        saveShoppingList();
    }
}
function stepShoppingItemQty(id, delta) {
    const item = shoppingList.find(i => i.id === id);
    if (!item) return;

    const currentStr = String(item.qty || '1').trim();
    const match = currentStr.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);

    if (match) {
        const num = parseFloat(match[1].replace(',', '.'));
        const unit = match[2] ? ` ${match[2]}` : '';
        const nextNum = Math.max(1, num + delta);
        item.qty = `${nextNum}${unit}`;
    } else {
        item.qty = delta > 0 ? '2' : '1';
    }
    saveShoppingList();
}

function deleteShoppingItem(id) {
    shoppingList = shoppingList.filter(i => i.id !== id);
    saveShoppingList();
}

function clearCheckedShoppingItems() {
    shoppingList = shoppingList.map(item => {
        if (item.checked && (item.currency || currentCurrency) === currentCurrency) {
            return { ...item, checked: false, price: 0 };
        }
        return item;
    });
    saveShoppingList();
}

function renderShoppingList() {
    updateShoppingCategoryDropdown();

    const container = document.getElementById('shopping-list-container');
    const countEl = document.getElementById('shop-items-count');
    if (!container) return;

    const t = i18n[currentLang] || i18n['pt-BR'];
    const shopCats = t.shopCategories || {
        breakfast: "☕ Café da Manhã",
        kitchen: "🍳 Cozinha / Despensa",
        cleaning: "🧼 Limpeza",
        hygiene: "🧴 Higiene / Outros"
    };

    const currentItems = shoppingList.filter(i => (i.currency || currentCurrency) === currentCurrency);
    if (countEl) countEl.innerText = currentItems.length;

    updateShoppingCartTotalDisplay();

    if (currentItems.length === 0) {
        container.innerHTML = `<p class="p-6 text-center text-xs text-slate-400 italic">Sua lista de compras está vazia. Adicione o que precisa comprar acima.</p>`;
        return;
    }

    let html = '';
    Object.entries(shopCats).forEach(([catKey, catLabel]) => {
        const itemsInCat = currentItems.filter(i => {
            const normalizedCat = (i.category === 'lunch' || i.category === 'dinner' || !i.category) ? 'kitchen' : i.category;
            return normalizedCat === catKey;
        });

        if (itemsInCat.length === 0) return;

        html += `
            <div class="bg-slate-100/80 dark:bg-slate-700/40 px-4 py-2 flex justify-between items-center border-y border-slate-200/60 dark:border-slate-700">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">${catLabel}</span>
                <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">${itemsInCat.length} ${itemsInCat.length === 1 ? 'item' : 'itens'}</span>
            </div>
        `;

        html += itemsInCat.map(item => `
            <div class="p-3.5 px-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 transition-colors ${item.checked ? 'bg-slate-50/80 dark:bg-slate-800/40' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}">
                <div class="flex items-center gap-3 flex-1 min-w-[160px]">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem(${item.id})" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0">
                    <div class="truncate">
                        <p class="text-sm font-semibold ${item.checked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}">${item.name}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 ml-auto">
                    <div class="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button type="button" onclick="stepShoppingItemQty(${item.id}, -1)" class="px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Diminuir">-</button>
                        <input type="text" value="${item.qty}" 
                               onchange="updateShoppingItemQty(${item.id}, this.value)"
                               aria-label="Quantidade"
                               class="w-16 px-1 py-1 text-center bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none">
                        <button type="button" onclick="stepShoppingItemQty(${item.id}, 1)" class="px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Aumentar">+</button>
                    </div>

                    <input type="number" step="0.01" min="0" value="${item.price || ''}" placeholder="Preço un." 
                           oninput="updateShoppingItemPrice(${item.id}, this.value)"
                           class="w-24 px-2.5 py-1 text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold">
                    
                    <button onclick="deleteShoppingItem(${item.id})" class="text-slate-400 hover:text-rose-600 p-1.5" title="Excluir item permanentemente">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        `).join('');
    });

    container.innerHTML = html;
}
function finishShoppingAndRecord() {
    const checkedItems = shoppingList.filter(i => i.checked && (i.currency || currentCurrency) === currentCurrency);
    if (checkedItems.length === 0) {
        alert("Marque pelo menos um item no carrinho antes de concluir a compra.");
        return;
    }

    const total = checkedItems.reduce((sum, item) => {
        const unitPrice = Number(item.price || 0);
        const qtyNum = getNumericQty(item.qty);
        return sum + (unitPrice * qtyNum);
    }, 0);

    if (total <= 0) {
        alert("Informe o valor dos itens marcados para lançar a despesa.");
        return;
    }

    const selectedMethodId = Number(document.getElementById('shop-payment-method')?.value || 1);
    const methodObj = methods.find(m => m.id === selectedMethodId);
    const methodName = getMethodName(methodObj);
    const itemNames = checkedItems.map(i => `${i.name} (${i.qty})`).join(', ');

    if (confirm(`Deseja lançar uma despesa de ${formatCurrency(total)} (${methodName}) em Alimentação? Os itens permanecerão salvos na sua lista para futuras compras.`)) {
        transactions.push({
            id: Date.now(),
            description: `Compras de Casa (${checkedItems.length} itens)`,
            amount: total,
            currency: currentCurrency,
            date: new Date().toISOString().split('T')[0],
            categoryId: 8,
            paymentMethodId: selectedMethodId,
            status: 'paid',
            isRecurring: false,
            notes: itemNames
        });

        localStorage.setItem('finc_transactions', JSON.stringify(transactions));

        shoppingList = shoppingList.map(item => {
            if (item.checked && (item.currency || currentCurrency) === currentCurrency) {
                return { ...item, checked: false, price: 0 };
            }
            return item;
        });

        saveShoppingList();
        populateMonthFilterOptions();
        renderDashboard();
        renderTransactionsTable();
        switchTab('transactions');
    }
}


// ==========================================
// MÓDULO: METAS FINANCEIRAS
// ==========================================
function getTargets() {
    const data = localStorage.getItem('finc_targets_list');
    return data ? JSON.parse(data) : [];
}

function saveNewTarget(e) {
    if (e) e.preventDefault();

    const tLang = i18n[currentLang] || i18n['pt-BR'];
    const targets = getTargets();
    const currTargets = targets.filter(t => (t.currency || 'BRL') === currentCurrency);

    if (currTargets.length >= 3) {
        alert(tLang.limitReachedAlert);
        return;
    }

    const name = document.getElementById('target-name').value.trim();
    const amount = parseFloat(document.getElementById('target-amount').value);
    const savedAmount = parseFloat(document.getElementById('target-saved')?.value || 0);
    const date = document.getElementById('target-date').value;

    if (name && !isNaN(amount) && amount > 0 && date) {
        targets.push({
            id: Date.now(),
            name: name,
            amount: amount,
            saved: isNaN(savedAmount) ? 0 : savedAmount,
            date: date,
            currency: currentCurrency
        });

        localStorage.setItem('finc_targets_list', JSON.stringify(targets));
        
        document.getElementById('target-name').value = '';
        document.getElementById('target-amount').value = '';
        if (document.getElementById('target-saved')) document.getElementById('target-saved').value = '';
        document.getElementById('target-date').value = '';

        closeModal('modal-target');
        renderDashboard();
        renderModalTargetsList();
        triggerAutoBackup();
    }
}

function updateTargetUI() {
    const container = document.getElementById('targets-container');
    if (!container) return;

    const tLang = i18n[currentLang] || i18n['pt-BR'];
    const colors = getTargetColors();
    let targets = getTargets().filter(t => (t.currency || 'BRL') === currentCurrency);
    container.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < 3; i++) {
        const tgt = targets[i];
        const color = colors[i];

        if (tgt) {
            const savedVal = tgt.saved !== undefined ? tgt.saved : 0;
            const pct = Math.min(Math.round((savedVal / tgt.amount) * 100), 100);
            const isExpired = today > tgt.date && pct < 100;

            let msgText = tLang.inProgress;
            let msgColor = color.text;

            if (pct >= 100) {
                msgText = tLang.targetReached;
                msgColor = 'text-emerald-600 font-bold';
            } else if (isExpired) {
                msgText = tLang.targetExpired;
                msgColor = 'text-rose-500 font-semibold';
            }

            container.innerHTML += `
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 ${color.border}/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1.5 h-full ${color.bg}"></div>
                    <div class="pl-2">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="text-[10px] uppercase font-bold tracking-wider ${color.text} block">${color.name}</span>
                                <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[140px]">${tgt.name}</h4>
                            </div>
                            <span class="text-xs font-extrabold ${color.text}">${pct}%</span>
                        </div>
                        
                        <div class="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden my-2">
                            <div class="${color.bg} h-full transition-all duration-500" style="width: ${pct}%"></div>
                        </div>

                        <div class="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <span>${tLang.lblAllocated} <strong class="${color.text}">${formatCurrency(savedVal)}</strong></span>
                            <span>${tLang.lblTarget} <strong>${formatCurrency(tgt.amount)}</strong></span>
                        </div>
                    </div>

                    <div class="flex justify-between items-center pt-3 mt-2 border-t border-slate-100 dark:border-slate-700/60 pl-2">
                        <span class="text-[10px] ${msgColor}">${msgText}</span>
                        <button onclick="openDepositModal(${tgt.id})" class="px-2.5 py-1 ${color.btnBg} text-white rounded-lg text-[11px] font-bold transition shadow-sm active:scale-95 flex items-center gap-1">
                            <i class="fa-solid fa-plus text-[10px]"></i> ${tLang.btnDeposit}
                        </button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML += `
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between items-center text-center py-5 opacity-70">
                    <span class="text-[10px] uppercase font-bold tracking-wider ${color.text} block mb-1">${color.name}</span>
                    <p class="text-[11px] text-slate-400 italic mb-2">${tLang.availableSpace}</p>
                    <button onclick="openModal('modal-target')" class="text-xs font-semibold ${color.text} hover:underline">
                        ${tLang.btnConfigure} (${color.name})
                    </button>
                </div>
            `;
        }
    }
}

function renderModalTargetsList() {
    const tLang = i18n[currentLang] || i18n['pt-BR'];
    const targets = getTargets().filter(t => (t.currency || 'BRL') === currentCurrency);
    const colors = getTargetColors();
    const countEl = document.getElementById('target-count');
    const listEl = document.getElementById('modal-targets-list');
    const btnAdd = document.getElementById('btn-add-target');

    if (countEl) countEl.innerText = targets.length;
    if (btnAdd) btnAdd.disabled = targets.length >= 3;

    if (!listEl) return;

    listEl.innerHTML = '';
    if (targets.length === 0) {
        listEl.innerHTML = `<p class="text-xs text-slate-400 italic">${tLang.noTargets}</p>`;
        return;
    }

    targets.forEach((tgt, i) => {
        const color = colors[i];
        const savedVal = tgt.saved || 0;

        listEl.innerHTML += `
            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full ${color.bg}"></span>
                        <p class="text-xs font-bold text-slate-800 dark:text-slate-100">${tgt.name} (${color.name})</p>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                        ${tLang.lblAllocated} <strong class="${color.text}">${formatCurrency(savedVal, tgt.currency)}</strong> / ${formatCurrency(tgt.amount, tgt.currency)} • ${tLang.lblUntil}: ${tgt.date}
                    </p>
                </div>
                <button onclick="deleteTarget(${tgt.id})" class="text-slate-400 hover:text-rose-500 p-1">
                    <i class="fa-solid fa-trash text-sm"></i>
                </button>
            </div>
        `;
    });
}

function updateTargetAssignDropdown() {
    const assignSelect = document.getElementById('tx-target-assign');
    if (!assignSelect) return;

    const t = i18n[currentLang] || i18n['pt-BR'];
    const targets = getTargets().filter(tgt => (tgt.currency || 'BRL') === currentCurrency);
    const colors = getTargetColors();
    assignSelect.innerHTML = `<option value="">${t.noTargetAssign}</option>`;

    targets.forEach((tgt, i) => {
        const color = colors[i];
        assignSelect.innerHTML += `<option value="${tgt.id}">+ ${color.name}: ${tgt.name}</option>`;
    });
}

function deleteTarget(id) {
    let targets = getTargets();
    targets = targets.filter(t => t.id !== id);
    localStorage.setItem('finc_targets_list', JSON.stringify(targets));
    renderDashboard();
    renderModalTargetsList();
    triggerAutoBackup();
}

function openDepositModal(targetId) {
    const tLang = i18n[currentLang] || i18n['pt-BR'];
    const targets = getTargets();
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    document.getElementById('deposit-target-id').value = targetId;
    document.getElementById('modal-deposit-title').innerText = `${tLang.depositTitle}: ${target.name}`;
    document.getElementById('deposit-amount').value = '';
    openModal('modal-deposit');
}

function submitDeposit(e) {
    if (e) e.preventDefault();

    const targetId = Number(document.getElementById('deposit-target-id').value);
    const addVal = parseFloat(document.getElementById('deposit-amount').value);

    if (!isNaN(addVal) && addVal > 0) {
        let targets = getTargets();
        const targetIndex = targets.findIndex(t => t.id === targetId);

        if (targetIndex !== -1) {
            targets[targetIndex].saved = (targets[targetIndex].saved || 0) + addVal;
            localStorage.setItem('finc_targets_list', JSON.stringify(targets));
            closeModal('modal-deposit');
            renderDashboard();
            triggerAutoBackup();
        }
    }
}

function toggleTxStatus(id) {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index].status = transactions[index].status === 'paid' ? 'pending' : 'paid';
        localStorage.setItem('finc_transactions', JSON.stringify(transactions));
        renderTransactionsTable();
        renderDashboard();
        triggerAutoBackup();
    }
}

function deleteTransaction(id) {
    if (confirm('Deseja excluir esta transação?')) {
        transactions = transactions.filter(tx => tx.id !== Number(id));
        localStorage.setItem('finc_transactions', JSON.stringify(transactions));
        populateMonthFilterOptions();
        renderDashboard();
        renderTransactionsTable();
        triggerAutoBackup();
    }
}

function switchTab(tabName) {
    ['dashboard', 'transactions', 'shopping'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.classList.toggle('hidden', t !== tabName);
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-slate-800', 'shadow-sm', 'text-indigo-600', 'dark:text-white', 'font-semibold');
        btn.classList.add('text-slate-600', 'dark:text-slate-300', 'font-medium');
    });

    const activeBtn = document.getElementById(`nav-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-white', 'dark:bg-slate-800', 'shadow-sm', 'text-indigo-600', 'dark:text-white', 'font-semibold');
        activeBtn.classList.remove('text-slate-600', 'dark:text-slate-300', 'font-medium');
    }

    document.querySelectorAll('.mob-nav-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-900/40', 'dark:text-indigo-300', 'font-bold');
        btn.classList.add('text-slate-600', 'dark:text-slate-300', 'font-medium');
    });

    const activeMobBtn = document.getElementById(`mob-nav-${tabName}`);
    if (activeMobBtn) {
        activeMobBtn.classList.add('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-900/40', 'dark:text-indigo-300', 'font-bold');
        activeMobBtn.classList.remove('text-slate-600', 'dark:text-slate-300', 'font-medium');
    }

    if (tabName === 'dashboard') {
        if (myChart) myChart.resize();
        if (annualChart) annualChart.resize();
    }
}

function updateCategoryDropdowns() {
    const t = i18n[currentLang] || i18n['pt-BR'];

    const catSelect = document.getElementById('tx-category');
    if (catSelect) {
        catSelect.innerHTML = categories.map(c => {
            const catName = getCategoryName(c);
            const typeLabel = (c.type === 'Receita') ? t.typeIncome : t.typeExpense;
            return `<option value="${c.id}">${catName} (${typeLabel})</option>`;
        }).join('');
    }

    const catFilter = document.getElementById('tx-filter-category');
    if (catFilter) {
        const currentValue = catFilter.value || 'ALL';
        catFilter.innerHTML = `<option value="ALL">${t.allCategories}</option>` + 
            categories.map(c => `<option value="${c.id}">${getCategoryName(c)}</option>`).join('');
        catFilter.value = currentValue;
    }
}
function updateMethodDropdowns() {
    const t = i18n[currentLang] || i18n['pt-BR'];

    const methodSelect = document.getElementById('tx-method');
    if (methodSelect) {
        methodSelect.innerHTML = methods.map(m => `<option value="${m.id}">${getMethodName(m)}</option>`).join('');
    }

    const methodFilter = document.getElementById('tx-filter-method');
    if (methodFilter) {
        const currentValue = methodFilter.value || 'ALL';
        methodFilter.innerHTML = `<option value="ALL">${t.allMethods}</option>` + 
            methods.map(m => `<option value="${m.id}">${getMethodName(m)}</option>`).join('');
        methodFilter.value = currentValue;
    }

    const shopMethodSelect = document.getElementById('shop-payment-method');
    if (shopMethodSelect) {
        const currentShopMethod = shopMethodSelect.value || '1';
        shopMethodSelect.innerHTML = methods.map(m => `<option value="${m.id}">${getMethodName(m)}</option>`).join('');
        shopMethodSelect.value = currentShopMethod;
    }
}


function openModal(id) { 
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        if (id === 'modal-target') {
            renderModalTargetsList();
        }
        if (id === 'modal-transaction') {
            const txCurrSelect = document.getElementById('tx-currency');
            if (txCurrSelect) txCurrSelect.value = currentCurrency;
            updateTargetAssignDropdown();
        }
    }
}

function closeModal(id) { 
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden'); 
}

function toggleDarkMode() { 
    document.documentElement.classList.toggle('dark');
    renderAnnualChart();
}

function resetData() {
    if (confirm('Restaurar dados iniciais?')) {
        localStorage.clear();
        location.reload();
    }
}

function triggerAutoBackup() {
    const backupData = {
        version: "2.2",
        autoBackupDate: new Date().toISOString(),
        categories,
        methods,
        transactions,
        shoppingList,
        targets: getTargets(),
        activeCurrencies,
        currentCurrency,
        lang: currentLang
    };

    localStorage.setItem('finc_auto_backup_snapshot', JSON.stringify(backupData));
    updateSaveIndicator();
}

function updateSaveIndicator() {
    const indicator = document.getElementById('save-status-indicator');
    if (indicator) {
        const t = i18n[currentLang] || i18n['pt-BR'];
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        indicator.classList.remove('animate-pop');
        void indicator.offsetWidth;
        indicator.classList.add('animate-pop');

        indicator.innerHTML = `<i class="fa-solid fa-shield-halved text-emerald-500"></i> <span id="lbl-save-status">${t.saveStatus}</span> (${now})`;
    }
}

function exportToPDF() {
    const element = document.getElementById('tab-dashboard');
    if (typeof html2pdf !== 'undefined') {
        const opt = {
            margin:       0.5,
            filename:     `Relatorio_Financeiro_${currentCurrency}_${new Date().toISOString().split('T')[0]}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    } else {
        window.print();
    }
}

function sendByEmail() {
    const filterSelect = document.getElementById('dash-month-filter');
    const monthText = filterSelect ? filterSelect.options[filterSelect.selectedIndex].text : 'Geral';
    const balance = document.getElementById('card-balance')?.innerText || '0';
    const income = document.getElementById('card-income')?.innerText || '0';
    const expense = document.getElementById('card-expense')?.innerText || '0';

    const subject = encodeURIComponent(`Resumo Financeiro - ${monthText} (${currentCurrency})`);
    const body = encodeURIComponent(
        `Resumo Financeiro (${monthText}):\n\n` +
        `• Saldo Total: ${balance}\n` +
        `• Total Receitas: ${income}\n` +
        `• Total Despesas: ${expense}\n\n` +
        `Relatório gerado pelo Controle de Finanças.`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function exportBackup() {
    const backupData = {
        version: "2.2",
        exportDate: new Date().toISOString(),
        categories,
        methods,
        transactions,
        shoppingList,
        targets: getTargets(),
        activeCurrencies,
        currentCurrency,
        lang: currentLang
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `controle_financas_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.transactions || !Array.isArray(data.transactions)) {
                alert("Ficheiro de backup inválido.");
                return;
            }

            if (confirm("Deseja substituir seus dados atuais pelos dados do backup?")) {
                if (data.categories) localStorage.setItem('finc_categories', JSON.stringify(data.categories));
                if (data.methods) localStorage.setItem('finc_methods', JSON.stringify(data.methods));
                if (data.transactions) localStorage.setItem('finc_transactions', JSON.stringify(data.transactions));
                if (data.shoppingList) localStorage.setItem('finc_shopping_list', JSON.stringify(data.shoppingList));
                if (data.targets) localStorage.setItem('finc_targets_list', JSON.stringify(data.targets));
                if (data.activeCurrencies) localStorage.setItem('finc_active_currencies', JSON.stringify(data.activeCurrencies));
                if (data.currentCurrency) localStorage.setItem('finc_active_currency', data.currentCurrency);
                if (data.lang) localStorage.setItem('finc_lang', data.lang);

                alert("Backup restaurado com sucesso!");
                location.reload();
            }
        } catch (err) {
            alert("Erro ao ler JSON: " + err.message);
        }
    };
    reader.readAsText(file);
}
function getNumericQty(qtyStr) {
    const match = String(qtyStr || '1').trim().match(/^(\d+(?:[.,]\d+)?)/);
    return match ? parseFloat(match[1].replace(',', '.')) : 1;
}
function updateShoppingItemPrice(id, newPrice) {
    const item = shoppingList.find(i => i.id === id);
    if (item) {
        item.price = parseFloat(newPrice) || 0;
        item.checked = item.price > 0;
        localStorage.setItem('finc_shopping_list', JSON.stringify(shoppingList));
        updateShoppingCartTotalDisplay();
        triggerAutoBackup();
    }
}
function updateShoppingCartTotalDisplay() {
    const totalEl = document.getElementById('shop-total-amount');
    if (!totalEl) return;

    const currentItems = shoppingList.filter(i => (i.currency || currentCurrency) === currentCurrency);
    const cartTotal = currentItems.reduce((sum, item) => {
        if (!item.checked) return sum;
        const unitPrice = Number(item.price || 0);
        const qtyNum = getNumericQty(item.qty);
        return sum + (unitPrice * qtyNum);
    }, 0);

    totalEl.innerText = formatCurrency(cartTotal);
}
