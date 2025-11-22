using System.Security.Cryptography;
using System.Text;

namespace Backend.API.Services;

public class HashService
{
    public string CreateHash(string password)
    {
        var hash = SHA256.Create();

        return BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(password)));
    }
}