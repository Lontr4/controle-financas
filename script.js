// =========================================================================
// 1. CONFIGURAÇÃO DO FIREBASE (SUBSTITUA PELAS SUAS CHAVES DO FIREBASE CONSOLE)
// =========================================================================
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

let auth = null;
let db = null;
let currentUser = null;
let unsubscribeFirestore = null;

try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "SUA_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
    }
} catch (err) {
    console.warn("Firebase ainda não configurado com chaves reais:", err);
}

// =========================================================================
// 2. DICIONÁRIO MULTILÍNGUE (PT-BR, EN, JA, ES)
// =========================================================================
const i18n = {
    'pt-BR': {
        appTitle: "Controle de Finanças",
        navDash: "Painel",
        navTx: "Transações",
        navShop: "Compras",
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
        walletTitle: "Carteira:",
        btnAddCurrency: "Moeda",
        statusPaid: "Pago",
        statusPending: "Pendente",
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
        settingsSub: "Gerencie a segurança dos seus dados locais e na nuvem",
        manualBackupTitle: "Exportar & Importar Manual",
        btnResetData: "Restaurar Dados Iniciais",
        footerSettings: "Definições de Dados",
        footerPrivacy: "Política de Privacidade Local",
        saveStatusLocal: "Dados Salvos Localmente (Entre com Google para Nuvem)",
        saveStatusCloud: "Sincronizado em Tempo Real na Nuvem",
        allCategories: "Todas as Categorias",
        allMethods: "Todos os Métodos",
        typeExpense: "Despesa",
        typeIncome: "Receita",
        annualChartTitle: "Comparativo Anual de Gastos",
        annualChartSub: "Evolução mensal de despesas e receitas ao longo do ano",
        filterYear: "Ano:",
        allYears: "Todos os Anos",
        chartExpensesLabel: "Despesas",
        chartIncomeLabel: "Receitas",
        shopTitle: "Lista de Compras & Cômodos",
        shopSub: "Gerencie na lista padrão ou organize por cômodos da casa — ambos sincronizam o mesmo carrinho",
        shopCartTotal: "Total no Carrinho",
        btnCheckout: "Concluir e Lançar Gasto",
        modeStandard: "Lista Padrão",
        modeRooms: "Por Cômodos (Extra)",
        filterChecked: "Mostrar só marcados",
        filterAllItems: "Mostrar todos os itens",
        btnAddItem: "Adicionar",
        createRoomTitle: "Criar Novo Cômodo:",
        btnCreateRoom: "Criar Cômodo",
        emptyShopList: "Nenhum produto cadastrado ainda.",
        emptyRoomItems: "Nenhum produto neste cômodo.",
        quickAddPlaceholder: "+ Produto neste cômodo...",
        categories: { 1: "Aluguel", 2: "Gás", 3: "Energia", 4: "Internet Celular", 5: "Internet Casa", 6: "Água", 7: "Saúde", 8: "Alimentação", 9: "Academia", 10: "Escola", 11: "Entrada / Salário", 12: "Hobby / Lazer", 13: "Outros" },
        methods: { 1: "Cartão de Crédito", 2: "Dinheiro", 3: "Transferência Bancária" }
    },
    en: {
        appTitle: "Financial Control",
        navDash: "Dashboard",
        navTx: "Transactions",
        navShop: "Shopping",
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
        walletTitle: "Wallet:",
        btnAddCurrency: "Currency",
        statusPaid: "Paid",
        statusPending: "Pending",
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
        settingsSub: "Manage your local and cloud data security",
        manualBackupTitle: "Manual Export & Import",
        btnResetData: "Reset Initial Data",
        footerSettings: "Data Settings",
        footerPrivacy: "Local Privacy Policy",
        saveStatusLocal: "Saved Locally (Sign in with Google for Cloud)",
        saveStatusCloud: "Synced in Real-Time to Cloud",
        allCategories: "All Categories",
        allMethods: "All Payment Methods",
        typeExpense: "Expense",
        typeIncome: "Income",
        annualChartTitle: "Annual Expense Comparison",
        annualChartSub: "Monthly evolution of expenses and income throughout the year",
        filterYear: "Year:",
        allYears: "All Years",
        chartExpensesLabel: "Expenses",
        chartIncomeLabel: "Income",
        shopTitle: "Shopping List & House Rooms",
        shopSub: "Manage in the standard list or by house rooms — both sync the exact same cart",
        shopCartTotal: "Cart Total",
        btnCheckout: "Finish & Log Expense",
        modeStandard: "Standard List",
        modeRooms: "By Rooms (Extra)",
        filterChecked: "Show checked only",
        filterAllItems: "Show all items",
        btnAddItem: "Add",
        createRoomTitle: "Create New Room:",
        btnCreateRoom: "Create Room",
        emptyShopList: "No products added yet.",
        emptyRoomItems: "No products in this room.",
        quickAddPlaceholder: "+ Add item to room...",
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
        walletTitle: "通貨:",
        btnAddCurrency: "通貨追加",
        statusPaid: "支払済",
        statusPending: "保留中",
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
        settingsSub: "ローカルとクラウドのデータ管理",
        manualBackupTitle: "手動エクスポート・インポート",
        btnResetData: "初期データに戻す",
        footerSettings: "データ設定",
        footerPrivacy: "ローカルプライバシーポリシー",
        saveStatusLocal: "ローカル保存済（Googleログインでクラウド同期）",
        saveStatusCloud: "クラウドにリアルタイム同期中",
        allCategories: "すべてのカテゴリ",
        allMethods: "すべての決済方法",
        typeExpense: "支出",
        typeIncome: "収入",
        annualChartTitle: "年間支出比較（月別推移）",
        annualChartSub: "1年間の月別支出と収入の推移",
        filterYear: "対象年:",
        allYears: "すべての年",
        chartExpensesLabel: "支出",
        chartIncomeLabel: "収入",
        shopTitle: "買い物リスト＆部屋別管理",
        shopSub: "標準リストまたは家の部屋別カードで管理でき、カート内容は自動で連動します",
        shopCartTotal: "カート合計金額",
        btnCheckout: "完了して支出に登録",
        modeStandard: "標準リスト",
        modeRooms: "部屋別表示 (拡張)",
        filterChecked: "チェック済のみ表示",
        filterAllItems: "すべて表示",
        btnAddItem: "追加",
        createRoomTitle: "新しい部屋を作成:",
        btnCreateRoom: "部屋を追加",
        emptyShopList: "商品がまだ登録されていません。",
        emptyRoomItems: "この部屋には商品がまだありません。",
        quickAddPlaceholder: "+ この部屋に商品を追加...",
        categories: { 1: "家賃", 2: "ガス代", 3: "電気代", 4: "携帯通信費", 5: "固定回線", 6: "水道代", 7: "医療・健康", 8: "食費", 9: "ジム・フィットネス", 10: "教育・学費", 11: "給与・収入", 12: "趣味・娯楽", 13: "その他" },
        methods: { 1: "クレジットカード", 2: "現金", 3: "銀行振込" }
    },
    es: {
        appTitle: "Control Financiero",
        navDash: "Panel",
        navTx: "Transacciones",
        navShop: "Compras",
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
        overview: "Visión General (Todos los Meses)",
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
        walletTitle: "Cartera:",
        btnAddCurrency: "Moneda",
        statusPaid: "Pagado",
        statusPending: "Pendiente",
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
        settingsSub: "Gestiona la seguridad de tus datos locales y en la nube",
        manualBackupTitle: "Exportar e Importar Manual",
        btnResetData: "Restaurar Datos Iniciales",
        footerSettings: "Configuración de Datos",
        footerPrivacy: "Política de Privacidad Local",
        saveStatusLocal: "Guardado Localmente (Inicia con Google para Nube)",
        saveStatusCloud: "Sincronizado en Tiempo Real en la Nube",
        allCategories: "Todas las Categorías",
        allMethods: "Todos los Métodos",
        typeExpense: "Gasto",
        typeIncome: "Ingreso",
        annualChartTitle: "Comparativa Anual de Gastos",
        annualChartSub: "Evolución mensual de gastos e ingresos durante el año",
        filterYear: "Año:",
        allYears: "Todos los Años",
        chartExpensesLabel: "Gastos",
        chartIncomeLabel: "Ingresos",
        shopTitle: "Lista de Compras y Habitaciones",
        shopSub: "Gestiona en la lista estándar o por habitaciones — ambos sincronizan el mismo carrito",
        shopCartTotal: "Total en Carrito",
        btnCheckout: "Finalizar y Registrar Gasto",
        modeStandard: "Lista Estándar",
        modeRooms: "Por Habitaciones (Extra)",
        filterChecked: "Mostrar solo marcados",
        filterAllItems: "Mostrar todos los ítems",
        btnAddItem: "Agregar",
        createRoomTitle: "Crear Nueva Habitación:",
        btnCreateRoom: "Crear Habitación",
        emptyShopList: "Aún no hay productos registrados.",
        emptyRoomItems: "No hay productos en esta habitación.",
        quickAddPlaceholder: "+ Producto en habitación...",
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
let currentCurrency = localStorage.getItem('finc_active_currency') || 'JPY';
let activeCurrencies = JSON.parse(localStorage.getItem('finc_active_currencies')) || ['JPY', 'BRL'];

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
    { id: 1, description: 'Salário Exemplo', amount: 280000, currency: 'JPY', date: '2026-11-01', categoryId: 11, paymentMethodId: 3, status: 'paid', isRecurring: true, notes: 'Receita fixa mensal' },
    { id: 2, description: 'Supermercado Modelo', amount: 12500, currency: 'JPY', date: '2026-11-05', categoryId: 8, paymentMethodId: 1, status: 'paid', isRecurring: false, notes: 'Compras da semana' }
];

// =========================================================================
// 3. DADOS DE CÔMODOS & LISTA DE COMPRAS INTERLIGADOS
// =========================================================================
const initialRooms = [
    { id: 'room_kitchen', name: 'Cozinha', icon: '🍳' },
    { id: 'room_laundry', name: 'Lavanderia', icon: '🧼' },
    { id: 'room_bathroom', name: 'Banheiro', icon: '🚿' },
    { id: 'room_living', name: 'Sala / Geral', icon: '🛋️' }
];

const initialShoppingItems = [
    { id: 101, name: 'Arroz 5kg', roomId: 'room_kitchen', price: 0, checked: false },
    { id: 102, name: 'Ovos (10 un)', roomId: 'room_kitchen', price: 0, checked: false },
    { id: 103, name: 'Detergente', roomId: 'room_laundry', price: 0, checked: false },
    { id: 104, name: 'Papel Higiênico', roomId: 'room_bathroom', price: 0, checked: false }
];

let categories = JSON.parse(localStorage.getItem('finc_categories')) || initialCategories;
let methods = JSON.parse(localStorage.getItem('finc_methods')) || initialMethods;
let transactions = JSON.parse(localStorage.getItem('finc_transactions')) || initialTransactions;
let houseRooms = JSON.parse(localStorage.getItem('finc_house_rooms')) || initialRooms;
let shoppingItems = JSON.parse(localStorage.getItem('finc_shopping_items')) || initialShoppingItems;

let shoppingViewMode = localStorage.getItem('finc_shop_view_mode') || 'standard';
let shopOnlyChecked = false;

let myChart = null;
let annualChart = null;

// =========================================================================
// 4. SINCRONIZAÇÃO EM TEMPO REAL COM FIREBASE
// =========================================================================
if (auth) {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        updateAuthUI();
        if (user && db) {
            startFirestoreSync(user.uid);
        } else if (unsubscribeFirestore) {
            unsubscribeFirestore();
            unsubscribeFirestore = null;
        }
    });
}

function handleGoogleAuth() {
    if (!auth) {
        alert("Configure suas chaves do Firebase no topo do arquivo script.js para ativar o Login Google.");
        return;
    }
    if (currentUser) {
        if (confirm(`Conectado como ${currentUser.displayName || currentUser.email}. Deseja sair da conta?`)) {
            auth.signOut();
        }
    } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => alert("Erro no login Google: " + err.message));
    }
}

function updateAuthUI() {
    const avatar = document.getElementById('google-user-avatar');
    const lbl = document.getElementById('lbl-google-auth');
    if (!avatar || !lbl) return;

    if (currentUser) {
        avatar.src = currentUser.photoURL || "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";
        lbl.innerText = (currentUser.displayName || "Conta").split(' ')[0];
    } else {
        avatar.src = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";
        lbl.innerText = "Entrar";
    }
    updateSaveIndicator();
}

function startFirestoreSync(uid) {
    const docRef = db.collection('users').doc(uid);
    unsubscribeFirestore = docRef.onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            if (data.transactions) transactions = data.transactions;
            if (data.targets) localStorage.setItem('finc_targets_list', JSON.stringify(data.targets));
            if (data.activeCurrencies) activeCurrencies = data.activeCurrencies;
            if (data.houseRooms) houseRooms = data.houseRooms;
            if (data.shoppingItems) shoppingItems = data.shoppingItems;

            saveAllToLocalStorage();
            populateMonthFilterOptions();
            renderWalletCards();
            renderDashboard();
            renderTransactionsTable();

            // Só atualiza visualmente a lista de compras se o usuário não estiver digitando em um campo agora
            const activeTag = document.activeElement ? document.activeElement.tagName : '';
            if (activeTag !== 'INPUT') {
                renderShoppingModule();
            } else {
                updateShoppingCartTotal();
            }

            updateSaveIndicator();
        } else {
            pushStateToCloud();
        }
    });
}

function pushStateToCloud() {
    saveAllToLocalStorage();
    if (currentUser && db) {
        db.collection('users').doc(currentUser.uid).set({
            transactions,
            targets: getTargets(),
            activeCurrencies,
            houseRooms,
            shoppingItems,
            updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => console.error("Erro ao sincronizar nuvem:", err));
    }
    updateSaveIndicator();
}

function saveAllToLocalStorage() {
    localStorage.setItem('finc_transactions', JSON.stringify(transactions));
    localStorage.setItem('finc_active_currencies', JSON.stringify(activeCurrencies));
    localStorage.setItem('finc_active_currency', currentCurrency);
    localStorage.setItem('finc_house_rooms', JSON.stringify(houseRooms));
    localStorage.setItem('finc_shopping_items', JSON.stringify(shoppingItems));
}

// =========================================================================
// 5. INICIALIZAÇÃO & RECORRÊNCIAS
// =========================================================================
function processRecurringTransactions() {
    const today = new Date();
    const currentMonthStr = today.toISOString().substring(0, 7);
    let hasNewItems = false;

    transactions.filter(t => t.isRecurring).forEach(item => {
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

    if (hasNewItems) pushStateToCloud();
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
    setShoppingViewMode(shoppingViewMode);
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

// =========================================================================
// 6. COMPRAS PADRÃO + CÔMODOS DA CASA (TOTALMENTE INTERLIGADOS)
// =========================================================================
function setShoppingViewMode(mode) {
    shoppingViewMode = mode;
    localStorage.setItem('finc_shop_view_mode', mode);

    const stdView = document.getElementById('shopping-view-standard');
    const roomsView = document.getElementById('shopping-view-rooms');
    const btnStd = document.getElementById('btn-shop-mode-standard');
    const btnRooms = document.getElementById('btn-shop-mode-rooms');

    if (stdView && roomsView) {
        stdView.classList.toggle('hidden', mode !== 'standard');
        roomsView.classList.toggle('hidden', mode !== 'rooms');
    }

    if (btnStd && btnRooms) {
        if (mode === 'standard') {
            btnStd.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm";
            btnRooms.className = "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-600 dark:text-slate-300";
        } else {
            btnRooms.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm";
            btnStd.className = "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-600 dark:text-slate-300";
        }
    }

    renderShoppingModule();
}

function toggleOnlyCheckedFilter() {
    shopOnlyChecked = !shopOnlyChecked;
    const t = i18n[currentLang] || i18n['pt-BR'];
    const btn = document.getElementById('btn-filter-only-checked');
    const lbl = document.getElementById('lbl-filter-checked');

    if (lbl) lbl.innerText = shopOnlyChecked ? t.filterAllItems : t.filterChecked;
    if (btn) {
        btn.classList.toggle('bg-indigo-600', shopOnlyChecked);
        btn.classList.toggle('text-white', shopOnlyChecked);
        btn.classList.toggle('border-indigo-600', shopOnlyChecked);
    }
    renderShoppingModule();
}

function populateRoomSelectors() {
    const select = document.getElementById('shop-std-room');
    if (!select) return;
    select.innerHTML = houseRooms.map(r => `<option value="${r.id}">${r.icon} ${r.name}</option>`).join('');
}

function createNewRoom(e) {
    e.preventDefault();
    const nameInput = document.getElementById('new-room-name');
    const iconInput = document.getElementById('new-room-icon');
    const name = nameInput.value.trim();
    const icon = (iconInput.value.trim() || '🏠');

    if (!name) return;

    houseRooms.push({
        id: 'room_' + Date.now(),
        name,
        icon
    });

    nameInput.value = '';
    pushStateToCloud();
    populateRoomSelectors();
    renderShoppingModule();
}

function renameRoom(roomId) {
    const room = houseRooms.find(r => r.id === roomId);
    if (!room) return;
    const newName = prompt("Novo nome para o cômodo:", room.name);
    if (newName && newName.trim()) {
        room.name = newName.trim();
        pushStateToCloud();
        populateRoomSelectors();
        renderShoppingModule();
    }
}

function deleteRoom(roomId) {
    if (houseRooms.length <= 1) {
        alert("Mantenha pelo menos 1 cômodo cadastrado.");
        return;
    }
    if (!confirm("Excluir este cômodo? Os itens dele serão movidos para o primeiro cômodo.")) return;

    const fallbackRoomId = houseRooms.find(r => r.id !== roomId).id;
    shoppingItems.forEach(item => {
        if (item.roomId === roomId) item.roomId = fallbackRoomId;
    });
    houseRooms = houseRooms.filter(r => r.id !== roomId);

    pushStateToCloud();
    populateRoomSelectors();
    renderShoppingModule();
}

// Adicionar produto pela Lista Padrão
function addStandardShoppingItem(e) {
    e.preventDefault();
    const nameEl = document.getElementById('shop-std-name');
    const roomEl = document.getElementById('shop-std-room');
    const priceEl = document.getElementById('shop-std-price');

    const name = nameEl.value.trim();
    const roomId = roomEl.value || (houseRooms[0] && houseRooms[0].id);
    const price = parseFloat(priceEl.value) || 0;

    if (!name) return;

    shoppingItems.push({
        id: Date.now(),
        name,
        roomId,
        price,
        checked: price > 0
    });

    nameEl.value = '';
    priceEl.value = '';
    pushStateToCloud();
    renderShoppingModule();
}

// Adicionar produto diretamente dentro de um Retângulo de Cômodo
function addItemToRoom(e, roomId) {
    e.preventDefault();
    const input = document.getElementById(`quick-input-${roomId}`);
    if (!input) return;
    const name = input.value.trim();
    if (!name) return;

    shoppingItems.push({
        id: Date.now(),
        name,
        roomId,
        price: 0,
        checked: false
    });

    input.value = '';
    pushStateToCloud();
    renderShoppingModule();
}

function toggleShoppingItem(id) {
    const item = shoppingItems.find(i => i.id === id);
    if (!item) return;
    item.checked = !item.checked;
    pushStateToCloud();
    renderShoppingModule();
}

let priceSaveTimeout = null;

function updateShoppingItemPrice(id, val) {
    const item = shoppingItems.find(i => i.id === id);
    if (!item) return;

    item.price = parseFloat(val) || 0;
    if (item.price > 0) item.checked = true;

    // Atualiza apenas o total no topo sem destruir o input onde você está digitando
    updateShoppingCartTotal();
    saveAllToLocalStorage();

    // Aguarda 800ms após você parar de digitar para enviar para a nuvem
    clearTimeout(priceSaveTimeout);
    priceSaveTimeout = setTimeout(() => {
        pushStateToCloud();
    }, 800);
}

function deleteShoppingItem(id) {
    shoppingItems = shoppingItems.filter(i => i.id !== id);
    pushStateToCloud();
    renderShoppingModule();
}

function updateShoppingCartTotal() {
    const totalEl = document.getElementById('shopping-cart-total');
    if (!totalEl) return;

    const total = shoppingItems
        .filter(i => i.checked)
        .reduce((sum, i) => sum + Number(i.price || 0), 0);

    totalEl.innerText = formatCurrency(total, currentCurrency);
}

function renderShoppingModule() {
    populateRoomSelectors();
    updateShoppingCartTotal();
    renderStandardShoppingList();
    renderRoomsGrid();
}

function renderStandardShoppingList() {
    const container = document.getElementById('standard-shopping-list-container');
    if (!container) return;

    const t = i18n[currentLang] || i18n['pt-BR'];
    const visibleItems = shopOnlyChecked ? shoppingItems.filter(i => i.checked) : shoppingItems;

    if (visibleItems.length === 0) {
        container.innerHTML = `<p class="p-6 text-center text-xs text-slate-400 italic">${t.emptyShopList}</p>`;
        return;
    }

    container.innerHTML = visibleItems.map(item => {
        const room = houseRooms.find(r => r.id === item.roomId) || { icon: '🏠', name: 'Geral' };
        return `
            <div class="flex items-center justify-between gap-3 p-3.5 transition-colors ${item.checked ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}">
                <label class="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem(${item.id})" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500">
                    <div class="min-w-0">
                        <p class="text-xs sm:text-sm font-semibold truncate ${item.checked ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-100'}">${item.name}</p>
                        <span class="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mt-0.5">
                            ${room.icon} ${room.name}
                        </span>
                    </div>
                </label>

                <div class="flex items-center gap-2">
                    <input type="number" inputmode="decimal" step="0.01" min="0" value="${item.price || ''}" placeholder="0"
       oninput="updateShoppingItemPrice(${item.id}, this.value)"
       class="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-right font-bold">
                    <button onclick="deleteShoppingItem(${item.id})" class="text-slate-400 hover:text-rose-500 p-1">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderRoomsGrid() {
    const grid = document.getElementById('rooms-grid-container');
    if (!grid) return;

    const t = i18n[currentLang] || i18n['pt-BR'];

    grid.innerHTML = houseRooms.map(room => {
        const roomItems = shoppingItems.filter(i => i.roomId === room.id && (!shopOnlyChecked || i.checked));
        const checkedCount = shoppingItems.filter(i => i.roomId === room.id && i.checked).length;

        const itemsHtml = roomItems.length === 0
            ? `<p class="text-[11px] text-slate-400 italic py-3 text-center">${t.emptyRoomItems}</p>`
            : roomItems.map(item => `
                <div class="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl border ${item.checked ? 'bg-indigo-50/70 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700'}">
                    <label class="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem(${item.id})" class="w-3.5 h-3.5 rounded text-indigo-600">
                        <span class="text-xs font-medium truncate ${item.checked ? 'font-bold text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}">${item.name}</span>
                    </label>
                    <div class="flex items-center gap-1.5">
                        <input type="number" inputmode="decimal" step="0.01" min="0" value="${item.price || ''}" placeholder="0"
       oninput="updateShoppingItemPrice(${item.id}, this.value)"
       class="w-20 px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-[11px] text-right font-bold">
                        <button onclick="deleteShoppingItem(${item.id})" class="text-slate-400 hover:text-rose-500 px-1">
                            <i class="fa-solid fa-xmark text-xs"></i>
                        </button>
                    </div>
                </div>
            `).join('');

        return `
            <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between overflow-hidden">
                <!-- Cabeçalho do Retângulo do Cômodo -->
                <div class="px-4 py-3 bg-slate-50 dark:bg-slate-700/40 border-b border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">${room.icon}</span>
                        <h3 class="font-bold text-sm text-slate-900 dark:text-white">${room.name}</h3>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                            ${checkedCount} no carrinho
                        </span>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="renameRoom('${room.id}')" title="Renomear cômodo" class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="deleteRoom('${room.id}')" title="Excluir cômodo" class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Lista de Produtos dentro do Retângulo -->
                <div class="p-3.5 space-y-2 flex-1 max-h-64 overflow-y-auto">
                    ${itemsHtml}
                </div>

                <!-- Campo Rápido para Adicionar Produto neste Cômodo -->
                <form onsubmit="addItemToRoom(event, '${room.id}')" class="p-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700 flex gap-1.5">
                    <input type="text" id="quick-input-${room.id}" placeholder="${t.quickAddPlaceholder}" class="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                    <button type="submit" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </form>
            </div>
        `;
    }).join('');
}

function checkoutShoppingList() {
    const checkedItems = shoppingItems.filter(i => i.checked);
    if (checkedItems.length === 0) {
        alert("Marque pelo menos um item no carrinho antes de concluir.");
        return;
    }

    const total = checkedItems.reduce((sum, i) => sum + Number(i.price || 0), 0);
    if (total <= 0) {
        alert("Informe o valor dos produtos marcados para lançar a despesa.");
        return;
    }

    const itemsSummary = checkedItems.map(i => i.name).join(', ');
    const todayStr = new Date().toISOString().split('T')[0];

    transactions.push({
        id: Date.now(),
        description: `Compras (${checkedItems.length} itens)`,
        amount: total,
        currency: currentCurrency,
        date: todayStr,
        categoryId: 8, // Alimentação
        paymentMethodId: 1,
        status: 'paid',
        isRecurring: false,
        notes: itemsSummary
    });

    // Desmarca os itens comprados e zera os preços para a próxima ida ao mercado (mantendo o catálogo dos cômodos!)
    shoppingItems.forEach(item => {
        if (item.checked) {
            item.checked = false;
            item.price = 0;
        }
    });

    pushStateToCloud();
    populateMonthFilterOptions(todayStr.substring(0, 7));
    renderDashboard();
    renderTransactionsTable();
    renderShoppingModule();
    alert(`Despesa de ${formatCurrency(total)} lançada com sucesso!`);
}

// =========================================================================
// 7. CARTEIRA, DASHBOARD, METAS E TRANSAÇÕES
// =========================================================================
function toggleAddCurrencyDropdown() {
    const menu = document.getElementById('add-currency-menu');
    if (menu) menu.classList.toggle('hidden');
}

function activateCurrency(code) {
    if (!activeCurrencies.includes(code)) {
        activeCurrencies.push(code);
        pushStateToCloud();
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
    updateShoppingCartTotal();
}

function renderWalletCards() {
    const walletContainer = document.getElementById('active-currencies-cards');
    if (!walletContainer) return;

    const usedCurrencies = new Set(activeCurrencies);
    transactions.forEach(t => usedCurrencies.add(t.currency || 'BRL'));

    walletContainer.innerHTML = '';
    Array.from(usedCurrencies).forEach(code => {
        const conf = currencyConfig[code];
        if (!conf) return;

        let balance = 0;
        transactions.filter(t => t.currency === code).forEach(t => {
            const cat = categories.find(c => c.id === Number(t.categoryId));
            const amt = Number(t.amount || 0);
            if (cat && cat.type === 'Receita') balance += amt;
            else balance -= amt;
        });

        const isActive = code === currentCurrency;
        walletContainer.innerHTML += `
            <div onclick="switchCurrency('${code}')" 
                 class="cursor-pointer px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition-all shadow-sm hover:shadow-md ${
                     isActive 
                     ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-900/40 ring-1 ring-indigo-500/30' 
                     : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                 }">
                <div class="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                    <span>${conf.flag}</span>
                    <span>${conf.code}</span>
                </div>
                <span class="font-extrabold text-slate-900 dark:text-white">${formatCurrency(balance, code)}</span>
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
    renderShoppingModule();
}

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
        'btn-deposit-confirm': t.btnConfirmDeposit,
        'lbl-deposit-amount-input': t.depositAmountLbl,
        'lbl-btn-export-json': t.btnExportJson,
        'lbl-btn-import-json': t.btnImportJson,
        'modal-settings-title': t.settingsTitle,
        'modal-settings-sub': t.settingsSub,
        'lbl-manual-backup-title': t.manualBackupTitle,
        'lbl-btn-reset-data': t.btnResetData,
        'lbl-footer-settings': t.footerSettings,
        'lbl-footer-privacy': t.footerPrivacy,
        'lbl-annual-chart-title': t.annualChartTitle,
        'lbl-annual-chart-sub': t.annualChartSub,
        'lbl-filter-year': t.filterYear,
        'lbl-shop-cart-total': t.shopCartTotal,
        'lbl-btn-checkout': t.btnCheckout,
        'lbl-mode-standard': t.modeStandard,
        'lbl-mode-rooms': t.modeRooms,
        'lbl-btn-add-item': t.btnAddItem,
        'lbl-create-room-title': t.createRoomTitle,
        'lbl-btn-create-room': t.btnCreateRoom
    };

    Object.keys(elementsMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = elementsMap[id];
    });

    document.querySelectorAll('.lbl-btn-new-tx-sub').forEach(el => el.innerText = t.btnNewTx);
    updateCategoryDropdowns();
    updateMethodDropdowns();
    renderModalTargetsList();
    updateTargetAssignDropdown();
    updateSaveIndicator();
}

function populateMonthFilterOptions(selectedMonthValue = null) {
    const filterSelect = document.getElementById('dash-month-filter');
    if (!filterSelect) return;

    const currentSelected = selectedMonthValue || filterSelect.value || 'ALL';
    const t = i18n[currentLang] || i18n['pt-BR'];

    const monthsSet = new Set();
    transactions.filter(tx => tx.currency === currentCurrency).forEach(tx => {
        if (tx.date && tx.date.length >= 7) monthsSet.add(tx.date.substring(0, 7));
    });

    const sortedMonths = Array.from(monthsSet).sort().reverse();
    filterSelect.innerHTML = `<option value="ALL">${t.allMonths}</option>`;

    sortedMonths.forEach(m => {
        const [year, month] = m.split('-');
        const langLocale = currentLang === 'ja' ? 'ja-JP' : currentLang === 'es' ? 'es-ES' : currentLang === 'en' ? 'en-US' : 'pt-BR';
        const monthName = new Date(year, month - 1).toLocaleString(langLocale, { month: 'long' });
        const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        filterSelect.innerHTML += `<option value="${m}">${capitalized} / ${year}</option>`;
    });

    filterSelect.value = Array.from(filterSelect.options).some(opt => opt.value === currentSelected) ? currentSelected : 'ALL';
}

function renderDashboard() {
    const filterSelect = document.getElementById('dash-month-filter');
    if (!filterSelect) return;

    const selectedMonth = filterSelect.value;
    const periodBadge = document.getElementById('chart-period-badge');
    const t = i18n[currentLang] || i18n['pt-BR'];

    if (periodBadge) {
        periodBadge.innerText = selectedMonth === 'ALL' ? t.overview : (filterSelect.options[filterSelect.selectedIndex]?.text || t.overview);
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCatMap = {};

    const filteredTx = transactions.filter(tx => {
        if ((tx.currency || 'BRL') !== currentCurrency) return false;
        if (selectedMonth === 'ALL') return true;
        return tx.date && tx.date.startsWith(selectedMonth);
    });

    filteredTx.forEach(tx => {
        const cat = categories.find(c => c.id === Number(tx.categoryId));
        const amount = Number(tx.amount || 0);
        if (cat) {
            const catTranslatedName = getCategoryName(cat);
            if (cat.type === 'Receita') totalIncome += amount;
            else {
                totalExpense += amount;
                expenseByCatMap[catTranslatedName] = (expenseByCatMap[catTranslatedName] || 0) + amount;
            }
        }
    });

    const balance = totalIncome - totalExpense;
    document.getElementById('card-balance').innerText = formatCurrency(balance);
    document.getElementById('card-income').innerText = formatCurrency(totalIncome);
    document.getElementById('card-expense').innerText = formatCurrency(totalExpense);

    const badge = document.getElementById('balance-status-badge');
    if (badge) {
        badge.innerText = balance >= 0 ? t.positiveBalance : t.negativeBalance;
        badge.className = balance >= 0
            ? "mt-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
            : "mt-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300";
    }

    const sortedTx = [...filteredTx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
    const recentContainer = document.getElementById('recent-transactions-list');
    if (recentContainer) {
        recentContainer.innerHTML = sortedTx.length === 0
            ? `<p class="text-xs text-slate-400 italic">${t.noRecords}</p>`
            : sortedTx.map(tx => {
                const cat = categories.find(c => c.id === Number(tx.categoryId)) || { id: 13, name: 'Outros', type: 'Despesa' };
                const isIncome = cat.type === 'Receita';
                return `
                    <div class="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                        <div>
                            <p class="font-medium text-slate-800 dark:text-slate-200">${tx.description}</p>
                            <p class="text-[10px] text-slate-400">${getCategoryName(cat)} • ${tx.date}</p>
                        </div>
                        <span class="font-semibold ${isIncome ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}">
                            ${isIncome ? '+' : '-'}${formatCurrency(Number(tx.amount || 0))}
                        </span>
                    </div>
                `;
            }).join('');
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
    const total = values.reduce((a, b) => a + b, 0);

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
            labels,
            datasets: [{ data: values, backgroundColor: colors.slice(0, labels.length), borderWidth: 2, borderColor: '#ffffff' }]
        },
        plugins,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { position: 'right' },
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
    transactions.filter(tx => (tx.currency || 'BRL') === currentCurrency && tx.date).forEach(tx => yearsSet.add(tx.date.substring(0, 4)));

    const sortedYears = Array.from(yearsSet).sort().reverse();
    const prevSelectedYear = yearSelect.value;
    yearSelect.innerHTML = `<option value="ALL">${t.allYears}</option>` + sortedYears.map(y => `<option value="${y}">${y}</option>`).join('');
    yearSelect.value = (prevSelectedYear === 'ALL' || sortedYears.includes(prevSelectedYear)) ? prevSelectedYear : currentYear;

    const selectedYear = yearSelect.value;
    const monthlyExpenses = new Array(12).fill(0);
    const monthlyIncome = new Array(12).fill(0);

    transactions.forEach(tx => {
        if ((tx.currency || 'BRL') !== currentCurrency || !tx.date || tx.date.length < 7) return;
        if (selectedYear !== 'ALL' && !tx.date.startsWith(selectedYear)) return;
        const mIdx = parseInt(tx.date.substring(5, 7), 10) - 1;
        if (mIdx < 0 || mIdx > 11) return;
        const cat = categories.find(c => c.id === Number(tx.categoryId));
        if (cat && cat.type === 'Receita') monthlyIncome[mIdx] += Number(tx.amount || 0);
        else monthlyExpenses[mIdx] += Number(tx.amount || 0);
    });

    const langLocale = currentLang === 'ja' ? 'ja-JP' : currentLang === 'es' ? 'es-ES' : currentLang === 'en' ? 'en-US' : 'pt-BR';
    const refYear = selectedYear === 'ALL' ? Number(currentYear) : Number(selectedYear);
    const monthLabels = Array.from({ length: 12 }, (_, i) => new Date(refYear, i, 1).toLocaleString(langLocale, { month: 'short' }));

    if (annualChart) annualChart.destroy();
    annualChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [
                { label: t.chartExpensesLabel, data: monthlyExpenses, backgroundColor: '#f43f5e', borderRadius: 6, maxBarThickness: 28 },
                { label: t.chartIncomeLabel, data: monthlyIncome, backgroundColor: '#10b981', borderRadius: 6, maxBarThickness: 28 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
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

    const filteredList = transactions.filter(tx => {
        if ((tx.currency || 'BRL') !== currentCurrency) return false;
        const matchSearch = !searchText || (tx.description || '').toLowerCase().includes(searchText) || (tx.notes || '').toLowerCase().includes(searchText);
        const matchCat = filterCat === 'ALL' || String(tx.categoryId) === filterCat;
        const matchMethod = filterMethod === 'ALL' || String(tx.paymentMethodId) === filterMethod;
        const matchStatus = filterStatus === 'ALL' || tx.status === filterStatus;
        const matchStart = !filterDateStart || tx.date >= filterDateStart;
        const matchEnd = !filterDateEnd || tx.date <= filterDateEnd;
        return matchSearch && matchCat && matchMethod && matchStatus && matchStart && matchEnd;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-xs text-slate-400 italic">${t.noRecords}</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredList.map(tx => {
        const cat = categories.find(c => c.id === Number(tx.categoryId)) || { id: 13, name: 'Outros', type: 'Despesa' };
        const method = methods.find(m => m.id === Number(tx.paymentMethodId)) || { id: 2, name: 'Dinheiro' };
        const isIncome = cat.type === 'Receita';
        const isPaid = tx.status === 'paid';
        const statusBadge = isPaid
            ? `<button onclick="toggleTxStatus(${tx.id})" class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">${t.statusPaid}</button>`
            : `<button onclick="toggleTxStatus(${tx.id})" class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">${t.statusPending}</button>`;

        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="p-4 text-slate-500 text-xs">${tx.date}</td>
                <td class="p-4 font-medium text-slate-800 dark:text-slate-200 text-xs">${tx.description}</td>
                <td class="p-4"><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700">${getCategoryName(cat)}</span></td>
                <td class="p-4 text-slate-600 dark:text-slate-400 text-xs">${getMethodName(method)}</td>
                <td class="p-4 text-right font-bold text-xs ${isIncome ? 'text-emerald-600' : ''}">${isIncome ? '+' : '-'}${formatCurrency(Number(tx.amount || 0), tx.currency)}</td>
                <td class="p-4 text-center">${statusBadge}</td>
                <td class="p-4 text-center text-xs text-slate-500 max-w-[140px] truncate" title="${tx.notes || ''}">${tx.notes || '-'}</td>
                <td class="p-4 text-center">
                    <button onclick="deleteTransaction(${tx.id})" class="text-slate-400 hover:text-rose-600 p-1"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
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

    transactions.push({
        id: Date.now(),
        description: desc,
        amount,
        currency: txCurrency,
        date,
        categoryId: catId,
        paymentMethodId: methodId,
        status,
        isRecurring,
        notes
    });

    if (assignedTargetId) {
        const targets = getTargets();
        const idx = targets.findIndex(t => t.id === Number(assignedTargetId));
        if (idx !== -1) {
            targets[idx].saved = (targets[idx].saved || 0) + amount;
            localStorage.setItem('finc_targets_list', JSON.stringify(targets));
        }
    }

    if (!activeCurrencies.includes(txCurrency)) activeCurrencies.push(txCurrency);
    currentCurrency = txCurrency;
    pushStateToCloud();

    populateMonthFilterOptions(date.substring(0, 7));
    renderWalletCards();
    renderDashboard();
    renderTransactionsTable();
    closeModal('modal-transaction');
    document.getElementById('form-transaction').reset();
    document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
}

function getTargets() {
    const data = localStorage.getItem('finc_targets_list');
    return data ? JSON.parse(data) : [];
}

function saveNewTarget(e) {
    if (e) e.preventDefault();
    const tLang = i18n[currentLang] || i18n['pt-BR'];
    const targets = getTargets();
    if (targets.filter(t => (t.currency || 'BRL') === currentCurrency).length >= 3) {
        alert(tLang.limitReachedAlert);
        return;
    }

    const name = document.getElementById('target-name').value.trim();
    const amount = parseFloat(document.getElementById('target-amount').value);
    const savedAmount = parseFloat(document.getElementById('target-saved')?.value || 0);
    const date = document.getElementById('target-date').value;

    if (name && amount > 0 && date) {
        targets.push({ id: Date.now(), name, amount, saved: isNaN(savedAmount) ? 0 : savedAmount, date, currency: currentCurrency });
        localStorage.setItem('finc_targets_list', JSON.stringify(targets));
        pushStateToCloud();
        closeModal('modal-target');
        renderDashboard();
        renderModalTargetsList();
    }
}

function updateTargetUI() {
    const container = document.getElementById('targets-container');
    if (!container) return;

    const tLang = i18n[currentLang] || i18n['pt-BR'];
    const colors = getTargetColors();
    const targets = getTargets().filter(t => (t.currency || 'BRL') === currentCurrency);
    container.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const tgt = targets[i];
        const color = colors[i];
        if (tgt) {
            const pct = Math.min(Math.round(((tgt.saved || 0) / tgt.amount) * 100), 100);
            container.innerHTML += `
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 ${color.border}/30 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="text-[10px] uppercase font-bold ${color.text} block">${color.name}</span>
                                <h4 class="font-bold text-sm text-slate-900 dark:text-white">${tgt.name}</h4>
                            </div>
                            <span class="text-xs font-extrabold ${color.text}">${pct}%</span>
                        </div>
                        <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden my-2">
                            <div class="${color.bg} h-full" style="width: ${pct}%"></div>
                        </div>
                        <div class="flex justify-between text-[11px] text-slate-500">
                            <span>${tLang.lblAllocated} <strong>${formatCurrency(tgt.saved || 0)}</strong></span>
                            <span>${tLang.lblTarget} <strong>${formatCurrency(tgt.amount)}</strong></span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
                        <span class="text-[10px] ${color.text}">${pct >= 100 ? tLang.targetReached : tLang.inProgress}</span>
                        <button onclick="openDepositModal(${tgt.id})" class="px-2.5 py-1 ${color.btnBg} text-white rounded-lg text-[11px] font-bold">+ ${tLang.btnDeposit}</button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML += `
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center py-5 opacity-70">
                    <span class="text-[10px] uppercase font-bold ${color.text} mb-1">${color.name}</span>
                    <button onclick="openModal('modal-target')" class="text-xs font-semibold ${color.text} hover:underline">${tLang.btnConfigure}</button>
                </div>
            `;
        }
    }
}

function renderModalTargetsList() {
    const tLang = i18n[currentLang] || i18n['pt-BR'];
    const targets = getTargets().filter(t => (t.currency || 'BRL') === currentCurrency);
    const listEl = document.getElementById('modal-targets-list');
    const countEl = document.getElementById('target-count');
    if (countEl) countEl.innerText = targets.length;
    if (!listEl) return;

    listEl.innerHTML = targets.length === 0
        ? `<p class="text-xs text-slate-400 italic">${tLang.noTargets}</p>`
        : targets.map(tgt => `
            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p class="text-xs font-bold">${tgt.name} — ${formatCurrency(tgt.saved || 0)} / ${formatCurrency(tgt.amount)}</p>
                <button onclick="deleteTarget(${tgt.id})" class="text-slate-400 hover:text-rose-500"><i class="fa-solid fa-trash text-xs"></i></button>
            </div>
        `).join('');
}

function updateTargetAssignDropdown() {
    const assignSelect = document.getElementById('tx-target-assign');
    if (!assignSelect) return;
    const t = i18n[currentLang] || i18n['pt-BR'];
    const targets = getTargets().filter(tgt => (tgt.currency || 'BRL') === currentCurrency);
    assignSelect.innerHTML = `<option value="">${t.noTargetAssign}</option>` + targets.map(tgt => `<option value="${tgt.id}">+ ${tgt.name}</option>`).join('');
}

function deleteTarget(id) {
    const targets = getTargets().filter(t => t.id !== id);
    localStorage.setItem('finc_targets_list', JSON.stringify(targets));
    pushStateToCloud();
    renderDashboard();
    renderModalTargetsList();
}

function openDepositModal(targetId) {
    document.getElementById('deposit-target-id').value = targetId;
    document.getElementById('deposit-amount').value = '';
    openModal('modal-deposit');
}

function submitDeposit(e) {
    if (e) e.preventDefault();
    const targetId = Number(document.getElementById('deposit-target-id').value);
    const addVal = parseFloat(document.getElementById('deposit-amount').value);
    if (addVal > 0) {
        const targets = getTargets();
        const idx = targets.findIndex(t => t.id === targetId);
        if (idx !== -1) {
            targets[idx].saved = (targets[idx].saved || 0) + addVal;
            localStorage.setItem('finc_targets_list', JSON.stringify(targets));
            pushStateToCloud();
            closeModal('modal-deposit');
            renderDashboard();
        }
    }
}

function toggleTxStatus(id) {
    const idx = transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
        transactions[idx].status = transactions[idx].status === 'paid' ? 'pending' : 'paid';
        pushStateToCloud();
        renderTransactionsTable();
        renderDashboard();
    }
}

function deleteTransaction(id) {
    if (confirm('Deseja excluir esta transação?')) {
        transactions = transactions.filter(tx => tx.id !== Number(id));
        pushStateToCloud();
        populateMonthFilterOptions();
        renderDashboard();
        renderTransactionsTable();
    }
}

function switchTab(tabName) {
    ['dashboard', 'transactions', 'shopping'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.classList.toggle('hidden', t !== tabName);

        const deskBtn = document.getElementById(`nav-${t}`);
        if (deskBtn) {
            if (t === tabName) {
                deskBtn.className = "nav-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition-all text-indigo-600 bg-white dark:bg-slate-800 shadow-sm dark:text-white";
            } else {
                deskBtn.className = "nav-btn px-3.5 py-2 rounded-xl text-xs font-medium transition-all text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60";
            }
        }

        const mobBtn = document.getElementById(`mob-nav-${t}`);
        if (mobBtn) {
            if (t === tabName) {
                mobBtn.className = "mob-nav-btn flex-1 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300";
            } else {
                mobBtn.className = "mob-nav-btn flex-1 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300";
            }
        }
    });

    if (tabName === 'dashboard') {
        if (myChart) myChart.resize();
        if (annualChart) annualChart.resize();
    }
    if (tabName === 'shopping') {
        renderShoppingModule();
    }
}

function updateCategoryDropdowns() {
    const t = i18n[currentLang] || i18n['pt-BR'];
    const catSelect = document.getElementById('tx-category');
    if (catSelect) {
        catSelect.innerHTML = categories.map(c => `<option value="${c.id}">${getCategoryName(c)} (${c.type === 'Receita' ? t.typeIncome : t.typeExpense})</option>`).join('');
    }
    const catFilter = document.getElementById('tx-filter-category');
    if (catFilter) {
        catFilter.innerHTML = `<option value="ALL">${t.allCategories}</option>` + categories.map(c => `<option value="${c.id}">${getCategoryName(c)}</option>`).join('');
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
        methodFilter.innerHTML = `<option value="ALL">${t.allMethods}</option>` + methods.map(m => `<option value="${m.id}">${getMethodName(m)}</option>`).join('');
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        if (id === 'modal-target') renderModalTargetsList();
        if (id === 'modal-transaction') {
            document.getElementById('tx-currency').value = currentCurrency;
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

function updateSaveIndicator() {
    const indicator = document.getElementById('save-status-indicator');
    if (!indicator) return;
    const t = i18n[currentLang] || i18n['pt-BR'];
    if (currentUser) {
        indicator.innerHTML = `<i class="fa-solid fa-cloud-arrow-up text-indigo-500 text-sm"></i> <span>${t.saveStatusCloud}</span>`;
    } else {
        indicator.innerHTML = `<i class="fa-solid fa-shield-halved text-emerald-500 text-sm"></i> <span>${t.saveStatusLocal}</span>`;
    }
}

function exportToPDF() {
    const element = document.getElementById('tab-dashboard');
    if (typeof html2pdf !== 'undefined') {
        html2pdf().set({
            margin: 0.5,
            filename: `Relatorio_Financeiro_${currentCurrency}_${new Date().toISOString().split('T')[0]}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).from(element).save();
    } else {
        window.print();
    }
}

function sendByEmail() {
    const balance = document.getElementById('card-balance')?.innerText || '0';
    const income = document.getElementById('card-income')?.innerText || '0';
    const expense = document.getElementById('card-expense')?.innerText || '0';
    const subject = encodeURIComponent(`Resumo Financeiro (${currentCurrency})`);
    const body = encodeURIComponent(`Saldo Total: ${balance}\nTotal Receitas: ${income}\nTotal Despesas: ${expense}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function exportBackup() {
    const backupData = {
        version: "3.0",
        exportDate: new Date().toISOString(),
        categories,
        methods,
        transactions,
        targets: getTargets(),
        activeCurrencies,
        currentCurrency,
        houseRooms,
        shoppingItems
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `controle_financas_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.transactions) return alert("Ficheiro inválido.");
            if (confirm("Substituir dados atuais pelo backup?")) {
                if (data.transactions) transactions = data.transactions;
                if (data.targets) localStorage.setItem('finc_targets_list', JSON.stringify(data.targets));
                if (data.activeCurrencies) activeCurrencies = data.activeCurrencies;
                if (data.houseRooms) houseRooms = data.houseRooms;
                if (data.shoppingItems) shoppingItems = data.shoppingItems;
                pushStateToCloud();
                location.reload();
            }
        } catch (err) {
            alert("Erro ao ler JSON: " + err.message);
        }
    };
    reader.readAsText(file);
}