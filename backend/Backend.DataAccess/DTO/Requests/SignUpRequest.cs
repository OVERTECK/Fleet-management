namespace Backend.DataAccess.DTO.Requests;

public class SignUpRequest
{
    public required string Login { get; set; }

    public required string Password { get; set; }

    public required int RoleId { get; set; }
}