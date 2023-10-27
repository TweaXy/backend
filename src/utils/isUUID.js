export default function isUUID(UUID) {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phonePattern = /^[0-9]+$/;

    if (emailPattern.test(UUID) || phonePattern.test(UUID)) return true;

    if (typeof UUID === 'string' && UUID.length >= 4 && UUID.length <= 191)
        return true;

    return false;
}
