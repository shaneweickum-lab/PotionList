// RevenueCat web SDK integration
// Uses @revenuecat/purchases-js

let Purchases = null
let rcInitialized = false

export async function initRevenueCat(userId) {
  const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY
  if (!apiKey) {
    console.warn('RevenueCat API key not configured. IAP will be simulated.')
    return
  }
  try {
    const mod = await import('@revenuecat/purchases-js')
    Purchases = mod.Purchases
    await Purchases.configure(apiKey, userId)
    rcInitialized = true
  } catch (err) {
    console.error('RevenueCat init failed:', err)
  }
}

export async function getOfferings() {
  if (!rcInitialized || !Purchases) return null
  try {
    return await Purchases.getSharedInstance().getOfferings()
  } catch (err) {
    console.error('RC getOfferings failed:', err)
    return null
  }
}

export async function purchaseProduct(rcProductId) {
  if (!rcInitialized || !Purchases) {
    // Simulate purchase in dev
    await new Promise(r => setTimeout(r, 1500))
    return { success: true, simulated: true }
  }
  try {
    const offerings = await Purchases.getSharedInstance().getOfferings()
    const pkg = Object.values(offerings?.current?.availablePackages ?? {})
      .find(p => p.identifier === rcProductId)
    if (!pkg) throw new Error(`Package ${rcProductId} not found`)
    const result = await Purchases.getSharedInstance().purchase({ rcPackage: pkg })
    return { success: true, result }
  } catch (err) {
    if (err?.userCancelled) return { success: false, cancelled: true }
    console.error('Purchase failed:', err)
    return { success: false, error: err?.message ?? 'Purchase failed' }
  }
}

export async function restorePurchases() {
  if (!rcInitialized || !Purchases) return null
  try {
    return await Purchases.getSharedInstance().restorePurchases()
  } catch (err) {
    console.error('RC restore failed:', err)
    return null
  }
}
