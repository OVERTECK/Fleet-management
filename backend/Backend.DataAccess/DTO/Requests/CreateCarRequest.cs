using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.DTO.Requests;

public record CreateCarRequest(
    [Required] string VIN,
    [Required] string Model,
    [Required] string Number,
    [Required] string Status,
    [Required] int TotalKM);