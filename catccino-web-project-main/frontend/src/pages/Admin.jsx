import { useCallback, useEffect, useState } from "react";
import { menuApi } from "../api/services.js";
import { useToast } from "../context/ToastContext.jsx";
import { EmptyState, money } from "../components/UI.jsx";

export default function Admin() {
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [status, setStatus] = useState("loading");
	const showToast = useToast();

	const load = useCallback(() => {
		setStatus("loading");
		Promise.all([menuApi.listCategories(), menuApi.listProducts()])
			.then(([cats, prods]) => {
				setCategories(cats);
				setProducts(prods);
				setStatus("ready");
			})
			.catch((err) => {
				showToast(err.message, true);
				setStatus("error");
			});
	}, [showToast]);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<section>
			<div className="mb-2">
				<h2 className="text-2xl">Painel administrativo</h2>
				<p className="mt-1 text-sm text-ink-soft">
					Cadastre categorias e produtos do cardápio.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<CategoryPanel categories={categories} onChanged={load} />
				<ProductPanel categories={categories} products={products} status={status} onChanged={load} />
			</div>
		</section>
	);
}

function CategoryPanel({ categories, onChanged }) {
	const showToast = useToast();
	const [form, setForm] = useState({ name: "", slug: "" });
	const [saving, setSaving] = useState(false);

	async function handleCreate(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await menuApi.createCategory(form);
			showToast("Categoria criada com sucesso.");
			setForm({ name: "", slug: "" });
			onChanged();
		} catch (err) {
			showToast(err.message, true);
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		try {
			await menuApi.deleteCategory(id);
			showToast("Categoria removida.");
			onChanged();
		} catch (err) {
			showToast(err.message, true);
		}
	}

	return (
		<div className="rounded-2xl border border-line bg-paper p-5">
			<h3 className="text-lg">Categorias</h3>

			<form onSubmit={handleCreate} className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-end">
				<label className="flex-1">
					<span className="mb-1 block text-xs font-semibold text-ink-soft">Nome (4–12 caracteres)</span>
					<input
						required
						minLength={4}
						maxLength={12}
						value={form.name}
						onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
						style={{ borderWidth: "1.5px" }}
						className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-coffee focus:outline-none"
					/>
				</label>
				<label className="flex-1">
					<span className="mb-1 block text-xs font-semibold text-ink-soft">Slug (4–12 caracteres)</span>
					<input
						required
						minLength={4}
						maxLength={12}
						value={form.slug}
						onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
						style={{ borderWidth: "1.5px" }}
						className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-coffee focus:outline-none"
					/>
				</label>
				<button
					type="submit"
					disabled={saving}
					className="rounded-full bg-coffee px-4 py-2 text-sm font-semibold text-paper disabled:opacity-50"
				>
					Criar
				</button>
			</form>

			<ul className="mt-4 flex flex-col gap-2">
				{categories.length === 0 && (
					<li className="text-sm text-ink-soft">Nenhuma categoria cadastrada ainda.</li>
				)}
				{categories.map((c) => (
					<li
						key={c.id}
						className="flex items-center justify-between rounded-lg border border-line bg-cream px-3 py-2 text-sm"
					>
						<span>
							<b>{c.name}</b> <span className="text-ink-soft">({c.slug})</span>
						</span>
						<button onClick={() => handleDelete(c.id)} className="text-xs font-semibold text-rust">
							excluir
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB — mesmo limite do multer no menu-service

function ProductPanel({ categories, products, status, onChanged }) {
	const showToast = useToast();
	const emptyForm = { name: "", description: "", price: "", categoryId: "", available: true };
	const [form, setForm] = useState(emptyForm);
	const [imgFile, setImgFile] = useState(null);
	const [imgPreview, setImgPreview] = useState(null);
	const [saving, setSaving] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editDraft, setEditDraft] = useState({});

	function update(e) {
		const { name, value, type, checked } = e.target;
		setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
	}

	useEffect(() => {
		return () => {
			if (imgPreview) URL.revokeObjectURL(imgPreview);
		};
	}, [imgPreview]);

	function handleImageChange(e) {
		const file = e.target.files?.[0];
		if (imgPreview) URL.revokeObjectURL(imgPreview);

		if (!file) {
			setImgFile(null);
			setImgPreview(null);
			return;
		}
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			showToast("Formato de imagem inválido. Use PNG, JPG ou WEBP.", true);
			e.target.value = "";
			setImgFile(null);
			setImgPreview(null);
			return;
		}
		if (file.size > MAX_IMAGE_SIZE) {
			showToast("Imagem maior que 5MB.", true);
			e.target.value = "";
			setImgFile(null);
			setImgPreview(null);
			return;
		}
		setImgFile(file);
		setImgPreview(URL.createObjectURL(file));
	}

	function clearImage(inputEl) {
		if (imgPreview) URL.revokeObjectURL(imgPreview);
		setImgFile(null);
		setImgPreview(null);
		if (inputEl) inputEl.value = "";
	}

	async function handleCreate(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await menuApi.createProduct({ ...form, imgFile });
			showToast("Produto criado com sucesso.");
			setForm(emptyForm);
			clearImage(e.target.querySelector('input[type="file"]'));
			onChanged();
		} catch (err) {
			showToast(err.message, true);
		} finally {
			setSaving(false);
		}
	}

	function startEdit(p) {
		setEditingId(p.id);
		setEditDraft({ name: p.name, price: p.price, available: p.available });
	}

	async function saveEdit(id) {
		try {
			await menuApi.updateProduct(id, editDraft);
			showToast("Produto atualizado.");
			setEditingId(null);
			onChanged();
		} catch (err) {
			showToast(err.message, true);
		}
	}

	return (
		<div className="rounded-2xl border border-line bg-paper p-5">
			<h3 className="text-lg">Produtos</h3>

			<form onSubmit={handleCreate} className="mt-3 flex flex-col gap-2.5">
				<Field label="Nome (4–40)" name="name" value={form.name} onChange={update} required />
				<label className="block">
					<span className="mb-1 block text-xs font-semibold text-ink-soft">Descrição (8–300)</span>
					<textarea
						name="description"
						required
						minLength={8}
						maxLength={300}
						rows={2}
						value={form.description}
						onChange={update}
						style={{ borderWidth: "1.5px" }}
						className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-coffee focus:outline-none"
					/>
				</label>
				<div className="flex flex-wrap gap-2.5">
					<div className="flex-1">
						<Field
							label="Preço (R$)"
							name="price"
							type="number"
							step="0.01"
							min="0.01"
							max="1000"
							value={form.price}
							onChange={update}
							required
						/>
					</div>
					<label className="flex-1">
						<span className="mb-1 block text-xs font-semibold text-ink-soft">Categoria</span>
						<select
							name="categoryId"
							required
							value={form.categoryId}
							onChange={update}
							style={{ borderWidth: "1.5px" }}
							className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-coffee focus:outline-none"
						>
							<option value="" disabled>
								Selecione…
							</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</label>
				</div>
				<label className="block">
					<span className="mb-1 block text-xs font-semibold text-ink-soft">
						Foto do produto (opcional, PNG/JPG/WEBP até 5MB)
					</span>
					<div className="flex items-center gap-3">
						{imgPreview && (
							<img
								src={imgPreview}
								alt="Pré-visualização"
								className="h-14 w-14 flex-none rounded-lg border border-line object-cover"
							/>
						)}
						<input
							type="file"
							accept="image/png,image/jpeg,image/jpg,image/webp"
							onChange={handleImageChange}
							className="flex-1 text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-cream-2 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-coffee hover:file:bg-line"
						/>
					</div>
				</label>
				<label className="flex items-center gap-2 text-sm text-ink-soft">
					<input type="checkbox" name="available" checked={form.available} onChange={update} />
					Disponível para venda
				</label>
				<button
					type="submit"
					disabled={saving || categories.length === 0}
					className="self-start rounded-full bg-coffee px-4 py-2 text-sm font-semibold text-paper disabled:opacity-50"
				>
					Criar produto
				</button>
				{categories.length === 0 && (
					<span className="text-xs text-ink-soft">Crie uma categoria primeiro.</span>
				)}
			</form>

			<div className="mt-5">
				{status === "loading" && <EmptyState>Carregando produtos…</EmptyState>}
				{status === "ready" && products.length === 0 && <EmptyState>Nenhum produto cadastrado.</EmptyState>}
				{status === "ready" && products.length > 0 && (
					<ul className="flex flex-col gap-2">
						{products.map((p) => (
							<li key={p.id} className="rounded-lg border border-line bg-cream px-3 py-2.5 text-sm">
								{editingId === p.id ? (
									<div className="flex flex-wrap items-center gap-2">
										<input
											value={editDraft.name}
											onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
											style={{ borderWidth: "1.5px" }}
											className="min-w-0 flex-1 rounded border border-line bg-paper px-2 py-1"
										/>
										<input
											type="number"
											step="0.01"
											value={editDraft.price}
											onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
											style={{ borderWidth: "1.5px" }}
											className="w-24 rounded border border-line bg-paper px-2 py-1"
										/>
										<label className="flex items-center gap-1 text-xs">
											<input
												type="checkbox"
												checked={editDraft.available}
												onChange={(e) => setEditDraft((d) => ({ ...d, available: e.target.checked }))}
											/>
											disponível
										</label>
										<button onClick={() => saveEdit(p.id)} className="text-xs font-semibold text-sage">
											salvar
										</button>
										<button onClick={() => setEditingId(null)} className="text-xs text-ink-soft">
											cancelar
										</button>
									</div>
								) : (
									<div className="flex items-center justify-between gap-2">
										<span className="flex items-center gap-2.5">
											{p.thumbnailUrl ? (
												<img
													src={p.thumbnailUrl}
													alt={p.name}
													className="h-9 w-9 flex-none rounded-md border border-line object-cover"
												/>
											) : (
												<span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-line bg-cream-2 text-xs">
													☕
												</span>
											)}
											<span>
												<b>{p.name}</b>{" "}
												<span className="text-ink-soft">
													· {money(p.price)} · {p.available === false ? "indisponível" : "disponível"}
												</span>
											</span>
										</span>
										<button onClick={() => startEdit(p)} className="text-xs font-semibold text-coffee">
											editar
										</button>
									</div>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

function Field({ label, ...inputProps }) {
	return (
		<label className="block">
			<span className="mb-1 block text-xs font-semibold text-ink-soft">{label}</span>
			<input
				{...inputProps}
				style={{ borderWidth: "1.5px" }}
				className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-coffee focus:outline-none"
			/>
		</label>
	);
}
